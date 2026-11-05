import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import { Platform } from 'react-native';

const CHAVE_PRODUTOS_CADASTRADOS = '@bellaver/produtos-cadastrados';

export interface ProdutoCadastrado {
  id: string;
  nome: string;
  precoOriginal: string;
  precoDesconto: string;
  descricao: string;
  imagens: string[];
  estoque: number;
  tamanhos: string[];
}

type NovoProdutoCadastrado = Omit<ProdutoCadastrado, 'id'>;

export interface ImagemProdutoNova {
  uri: string;
  base64?: string | null;
  mimeType?: string | null;
}

function otimizarImagemWeb(uri: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const imagemHtml = new globalThis.Image();

    imagemHtml.onload = () => {
      const limite = 1200;
      const escala = Math.min(
        1,
        limite / Math.max(imagemHtml.naturalWidth, imagemHtml.naturalHeight)
      );
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(imagemHtml.naturalWidth * escala));
      canvas.height = Math.max(1, Math.round(imagemHtml.naturalHeight * escala));

      const contexto = canvas.getContext('2d');
      if (!contexto) {
        reject(new Error('Não foi possível preparar a imagem para o catálogo.'));
        return;
      }

      contexto.drawImage(imagemHtml, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.75));
    };

    imagemHtml.onerror = () => {
      reject(new Error('Não foi possível carregar a imagem selecionada.'));
    };
    imagemHtml.src = uri;
  });
}

export async function persistirImagemProduto(
  imagem: ImagemProdutoNova,
  indice: number
): Promise<string> {
  if (Platform.OS === 'web') {
    let uri = imagem.uri;

    if (/^blob:/i.test(uri)) {
      const resposta = await fetch(uri);
      if (!resposta.ok) {
        throw new Error('Não foi possível ler a imagem selecionada.');
      }
      const arquivo = await resposta.blob();
      uri = await new Promise<string>((resolve, reject) => {
        const leitor = new FileReader();
        leitor.onload = () => {
          if (typeof leitor.result === 'string') {
            resolve(leitor.result);
          } else {
            reject(new Error('Não foi possível preparar a imagem selecionada.'));
          }
        };
        leitor.onerror = () =>
          reject(new Error('Não foi possível ler a imagem selecionada.'));
        leitor.readAsDataURL(arquivo);
      });
    } else if (imagem.base64) {
      uri = `data:image/jpeg;base64,${imagem.base64}`;
    }

    if (!/^data:image\//i.test(uri) && !/^https?:\/\//i.test(uri)) {
      throw new Error('Formato de imagem inválido. Selecione outra imagem.');
    }

    return otimizarImagemWeb(uri);
  }

  const diretorio = FileSystem.documentDirectory;
  if (!diretorio) {
    throw new Error('O armazenamento local de imagens não está disponível.');
  }

  const pastaProdutos = `${diretorio}bellaver-produtos/`;
  const infoPasta = await FileSystem.getInfoAsync(pastaProdutos);
  if (!infoPasta.exists) {
    await FileSystem.makeDirectoryAsync(pastaProdutos, {
      intermediates: true,
    });
  }

  const extensao = imagem.uri.match(/\.([a-z0-9]+)(?:[?#]|$)/i)?.[1] || 'jpg';
  const destino = `${pastaProdutos}${Date.now()}-${indice}-${Math.random()
    .toString(36)
    .slice(2, 8)}.${extensao}`;
  await FileSystem.copyAsync({ from: imagem.uri, to: destino });
  return destino;
}

function validarProduto(valor: unknown): valor is ProdutoCadastrado {
  if (!valor || typeof valor !== 'object') {
    return false;
  }

  const produto = valor as Partial<ProdutoCadastrado>;
  return (
    typeof produto.id === 'string' &&
    typeof produto.nome === 'string' &&
    typeof produto.precoOriginal === 'string' &&
    typeof produto.precoDesconto === 'string' &&
    typeof produto.descricao === 'string' &&
    Array.isArray(produto.imagens) &&
    produto.imagens.every((imagem) => typeof imagem === 'string') &&
    typeof produto.estoque === 'number' &&
    Array.isArray(produto.tamanhos) &&
    produto.tamanhos.every((tamanho) => typeof tamanho === 'string')
  );
}

export async function listarProdutosCadastrados(): Promise<ProdutoCadastrado[]> {
  const dados = await AsyncStorage.getItem(CHAVE_PRODUTOS_CADASTRADOS);
  if (!dados) {
    return [];
  }

  const produtos: unknown = JSON.parse(dados);
  if (!Array.isArray(produtos) || !produtos.every(validarProduto)) {
    throw new Error('Os produtos salvos estão em um formato inválido.');
  }

  return produtos;
}

export async function salvarProdutoCadastrado(
  produto: NovoProdutoCadastrado
): Promise<ProdutoCadastrado> {
  const produtos = await listarProdutosCadastrados();
  const produtoSalvo: ProdutoCadastrado = {
    ...produto,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  };

  await AsyncStorage.setItem(
    CHAVE_PRODUTOS_CADASTRADOS,
    JSON.stringify([...produtos, produtoSalvo])
  );

  return produtoSalvo;
}

export async function removerProdutoCadastrado(id: string): Promise<void> {
  const produtos = await listarProdutosCadastrados();
  const produtosAtualizados = produtos.filter((produto) => produto.id !== id);
  if (produtosAtualizados.length === produtos.length) {
    throw new Error('O produto não foi encontrado no catálogo.');
  }

  await AsyncStorage.setItem(
    CHAVE_PRODUTOS_CADASTRADOS,
    JSON.stringify(produtosAtualizados)
  );
}

export async function atualizarImagemProduto(
  id: string,
  imagem: string,
  indice: number
): Promise<ProdutoCadastrado> {
  const produtos = await listarProdutosCadastrados();
  const posicao = produtos.findIndex((produto) => produto.id === id);
  if (posicao < 0) {
    throw new Error('O produto não foi encontrado no catálogo.');
  }

  const produtoAtualizado = { ...produtos[posicao] };
  const imagens = [...produtoAtualizado.imagens];
  imagens[indice] = imagem;
  produtoAtualizado.imagens = imagens;
  produtos[posicao] = produtoAtualizado;

  await AsyncStorage.setItem(
    CHAVE_PRODUTOS_CADASTRADOS,
    JSON.stringify(produtos)
  );

  return produtoAtualizado;
}

export async function buscarProdutoCadastrado(
  id: string
): Promise<ProdutoCadastrado | undefined> {
  const produtos = await listarProdutosCadastrados();
  return produtos.find((produto) => produto.id === id);
}
