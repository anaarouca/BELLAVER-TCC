import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImageManipulator from 'expo-image-manipulator';
import { Platform } from 'react-native';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { ADMIN_EMAIL } from '../auth/session';

const CHAVE_PRODUTOS_CADASTRADOS = '@bellaver/produtos-cadastrados';
const CHAVE_IMAGENS_PRODUTOS_LOCAIS = '@bellaver/imagens-produtos';
const COLECAO_PRODUTOS = 'produtos';
const LIMITE_IMAGEM_DATA_URL = 160_000;
let migracaoProdutosLegados: Promise<void> | null = null;

export const CATEGORIAS_PRODUTO = [
  { valor: 'feminino', nome: 'Feminino', rota: '/catalogo' },
  { valor: 'masculino', nome: 'Masculino', rota: '/catalogoMasculino' },
  { valor: 'acessorios', nome: 'Acessórios', rota: '/catalogoacessorios' },
  { valor: 'calcados', nome: 'Calçados', rota: '/catalogoCalcados' },
] as const;

export type CategoriaProduto = (typeof CATEGORIAS_PRODUTO)[number]['valor'];

export function obterTamanhosDisponiveis(
  categoria: CategoriaProduto | null,
  nome: string
): string[] {
  if (categoria === 'acessorios') {
    const nomeNormalizado = nome
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
    return /\b(?:anel|aneis)\b/.test(nomeNormalizado) ? ['P', 'M', 'G'] : [];
  }

  return categoria ? ['36', '38', '40', '42'] : [];
}

export interface ProdutoCadastrado {
  id: string;
  nome: string;
  categoria: CategoriaProduto;
  precoOriginal: string;
  precoDesconto: string;
  descricao: string;
  imagens: string[];
  estoque: number;
  tamanhos: string[];
}

type NovoProdutoCadastrado = Omit<ProdutoCadastrado, 'id'>;
type ProdutoCadastradoArmazenado = Omit<ProdutoCadastrado, 'categoria'> & {
  categoria?: CategoriaProduto;
};
type ProdutoCadastradoFirestore = Omit<
  ProdutoCadastrado,
  'id' | 'categoria' | 'imagens'
> & {
  categoria?: CategoriaProduto;
  imagens?: string[];
};

export interface ImagemProdutoNova {
  uri: string;
  base64?: string | null;
  mimeType?: string | null;
  width?: number;
  height?: number;
}

function otimizarImagemWeb(uri: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const imagemHtml = new globalThis.Image();

    imagemHtml.onload = () => {
      const canvas = document.createElement('canvas');
      const contexto = canvas.getContext('2d');
      if (!contexto) {
        reject(new Error('Não foi possível preparar a imagem para o catálogo.'));
        return;
      }

      let escala = Math.min(
        1,
        800 / Math.max(imagemHtml.naturalWidth, imagemHtml.naturalHeight)
      );

      for (let tentativa = 0; tentativa < 6; tentativa += 1) {
        canvas.width = Math.max(1, Math.round(imagemHtml.naturalWidth * escala));
        canvas.height = Math.max(1, Math.round(imagemHtml.naturalHeight * escala));
        contexto.drawImage(imagemHtml, 0, 0, canvas.width, canvas.height);

        const imagemComprimida = canvas.toDataURL(
          'image/jpeg',
          Math.max(0.35, 0.65 - tentativa * 0.06)
        );
        if (imagemComprimida.length <= LIMITE_IMAGEM_DATA_URL) {
          resolve(imagemComprimida);
          return;
        }

        escala *= 0.82;
      }

      reject(new Error('A imagem é grande demais para o catálogo gratuito.'));
    };

    imagemHtml.onerror = () => {
      reject(new Error('Não foi possível carregar a imagem selecionada.'));
    };
    imagemHtml.src = uri;
  });
}

export async function persistirImagemProduto(
  imagem: ImagemProdutoNova
): Promise<string> {
  if (Platform.OS === 'web') {
    let uri = imagem.uri;

    if (imagem.base64) {
      uri = `data:${imagem.mimeType ?? 'image/jpeg'};base64,${imagem.base64}`;
    } else if (/^blob:/i.test(uri)) {
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
    }

    if (!/^data:image\//i.test(uri) && !/^https?:\/\//i.test(uri)) {
      throw new Error('Formato de imagem inválido. Selecione outra imagem.');
    }

    return otimizarImagemWeb(uri);
  }

  const uri = imagem.uri;
  const larguras = [800, 640, 480, 360];
  const qualidades = [0.65, 0.55, 0.45, 0.35];

  for (let tentativa = 0; tentativa < larguras.length; tentativa += 1) {
    const largura = larguras[tentativa];
    const acoes: { resize: { width: number; height?: number } }[] = [];
    if (imagem.width && imagem.height) {
      const escala = Math.min(
        1,
        largura / Math.max(imagem.width, imagem.height)
      );
      if (escala < 1) {
        acoes.push({
          resize: {
            width: Math.max(1, Math.round(imagem.width * escala)),
            height: Math.max(1, Math.round(imagem.height * escala)),
          },
        });
      }
    } else {
      acoes.push({ resize: { width: largura } });
    }

    const resultado = await ImageManipulator.manipulateAsync(uri, acoes, {
      base64: true,
      compress: qualidades[tentativa],
      format: ImageManipulator.SaveFormat.JPEG,
    });

    if (!resultado.base64) {
      throw new Error('Não foi possível preparar a imagem para o catálogo.');
    }

    const dataUrl = `data:image/jpeg;base64,${resultado.base64}`;
    if (dataUrl.length <= LIMITE_IMAGEM_DATA_URL) {
      return dataUrl;
    }
  }

  throw new Error('A imagem é grande demais para o catálogo gratuito.');
}

async function obterImagensProdutosLocais(): Promise<Record<string, string[]>> {
  const dados = await AsyncStorage.getItem(CHAVE_IMAGENS_PRODUTOS_LOCAIS);
  if (!dados) {
    return {};
  }

  const imagens: unknown = JSON.parse(dados);
  if (
    !imagens ||
    typeof imagens !== 'object' ||
    Array.isArray(imagens) ||
    !Object.values(imagens).every(
      (produto) =>
        Array.isArray(produto) &&
        produto.every((imagem) => typeof imagem === 'string')
    )
  ) {
    throw new Error('As imagens locais dos produtos estão em um formato inválido.');
  }

  return imagens as Record<string, string[]>;
}

async function removerImagensProdutoLocal(id: string): Promise<void> {
  const produtos = await obterImagensProdutosLocais();
  delete produtos[id];
  await AsyncStorage.setItem(
    CHAVE_IMAGENS_PRODUTOS_LOCAIS,
    JSON.stringify(produtos)
  );
}

function validarProduto(
  valor: unknown
): valor is ProdutoCadastradoFirestore {
  if (!valor || typeof valor !== 'object') {
    return false;
  }

  const produto = valor as Record<string, unknown>;

  const categoriaValida =
    produto.categoria === undefined ||
    CATEGORIAS_PRODUTO.some(
      (categoria) => categoria.valor === produto.categoria
    );

  const precosValidos =
    (typeof produto.precoOriginal === 'string' ||
      typeof produto.precoOriginal === 'number') &&
    (typeof produto.precoDesconto === 'string' ||
      typeof produto.precoDesconto === 'number');

  const estoque = produto.estoque as unknown;
  const estoqueValido = (() => {
    if (typeof estoque === 'number') {
      return Number.isFinite(estoque) && estoque >= 0;
    }

    if (typeof estoque === 'string') {
      return /^\d+(?:\.\d+)?$/.test(estoque.trim());
    }

    return false;
  })();

  const imagensValidas =
    produto.imagens === undefined ||
    (Array.isArray(produto.imagens) &&
      produto.imagens.every((imagem) => typeof imagem === 'string'));

  return (
    typeof produto.nome === 'string' &&
    produto.nome.trim().length > 0 &&
    categoriaValida &&
    precosValidos &&
    typeof produto.descricao === 'string' &&
    imagensValidas &&
    estoqueValido &&
    Array.isArray(produto.tamanhos) &&
    produto.tamanhos.every((tamanho) => typeof tamanho === 'string')
  );
}

function validarProdutoLegado(
  valor: unknown
): valor is ProdutoCadastradoArmazenado {
  return (
    valor !== null &&
    typeof valor === 'object' &&
    typeof (valor as Partial<ProdutoCadastradoArmazenado>).id === 'string' &&
    Array.isArray((valor as Partial<ProdutoCadastradoArmazenado>).imagens) &&
    (valor as Partial<ProdutoCadastradoArmazenado>).imagens?.every(
      (imagem) => typeof imagem === 'string'
    ) === true &&
    validarProduto(valor)
  );
}

async function migrarProdutosLegados(): Promise<void> {
  const usuario = auth.currentUser;
  if (
    usuario?.email?.toLowerCase() !== ADMIN_EMAIL ||
    !usuario.emailVerified
  ) {
    return;
  }

  if (!migracaoProdutosLegados) {
    migracaoProdutosLegados = (async () => {
      const dados = await AsyncStorage.getItem(CHAVE_PRODUTOS_CADASTRADOS);
      const produtos: unknown = dados ? JSON.parse(dados) : [];
      if (
        !Array.isArray(produtos) ||
        !produtos.every(validarProdutoLegado)
      ) {
        throw new Error('Os produtos locais estão em um formato inválido.');
      }

      const imagensLocais = await obterImagensProdutosLocais();
      let imagensLocaisAlteradas = false;
      const produtosRemotos = await getDocs(collection(db, COLECAO_PRODUTOS));
      const documentosRemotos = new Map<
        string,
        (typeof produtosRemotos.docs)[number]
      >();
      produtosRemotos.docs.forEach((produto) =>
        documentosRemotos.set(produto.id, produto)
      );

      for (const produto of produtos) {
        const documentoRemoto = documentosRemotos.get(produto.id);
        const imagensRemotas = documentoRemoto?.data().imagens;
        if (Array.isArray(imagensRemotas) && imagensRemotas.length > 0) {
          if (imagensLocais[produto.id]) {
            delete imagensLocais[produto.id];
            imagensLocaisAlteradas = true;
          }
          continue;
        }

        const imagens = await Promise.all(
          produto.imagens.map((imagem) =>
            /^https?:\/\//i.test(imagem)
              ? imagem
              : persistirImagemProduto({ uri: imagem })
          )
        );
        const dadosProduto = {
          nome: produto.nome,
          categoria: produto.categoria ?? 'feminino',
          precoOriginal: produto.precoOriginal,
          precoDesconto: produto.precoDesconto,
          descricao: produto.descricao,
          imagens,
          estoque: produto.estoque,
          tamanhos: produto.tamanhos,
        };

        if (documentoRemoto) {
          await updateDoc(documentoRemoto.ref, {
            categoria: documentoRemoto.data().categoria ?? 'feminino',
            imagens,
          });
        } else {
          await setDoc(
            doc(db, COLECAO_PRODUTOS, produto.id),
            dadosProduto
          );
        }

        if (imagensLocais[produto.id]) {
          delete imagensLocais[produto.id];
          imagensLocaisAlteradas = true;
        }
      }

      if (dados) {
        await AsyncStorage.removeItem(CHAVE_PRODUTOS_CADASTRADOS);
      }

      const produtosComImagensLocais = await getDocs(
        collection(db, COLECAO_PRODUTOS)
      );
      for (const documento of produtosComImagensLocais.docs) {
        const imagens = imagensLocais[documento.id];
        if (!imagens?.length) {
          continue;
        }

        const dadosRemotos = documento.data();
        if (Array.isArray(dadosRemotos.imagens) && dadosRemotos.imagens.length) {
          delete imagensLocais[documento.id];
          imagensLocaisAlteradas = true;
          continue;
        }

        const imagensCarregadas = await Promise.all(
          imagens.map((imagem) =>
            /^https?:\/\//i.test(imagem)
              ? imagem
              : persistirImagemProduto({ uri: imagem })
          )
        );
        await updateDoc(documento.ref, {
          categoria: dadosRemotos.categoria ?? 'feminino',
          imagens: imagensCarregadas,
        });
        delete imagensLocais[documento.id];
        imagensLocaisAlteradas = true;
      }

      if (imagensLocaisAlteradas) {
        if (Object.keys(imagensLocais).length > 0) {
          await AsyncStorage.setItem(
            CHAVE_IMAGENS_PRODUTOS_LOCAIS,
            JSON.stringify(imagensLocais)
          );
        } else {
          await AsyncStorage.removeItem(CHAVE_IMAGENS_PRODUTOS_LOCAIS);
        }
      }
    })();
  }

  try {
    await migracaoProdutosLegados;
  } finally {
    migracaoProdutosLegados = null;
  }
}

export async function listarProdutosCadastrados(): Promise<ProdutoCadastrado[]> {
  await migrarProdutosLegados();
  const produtos = await getDocs(collection(db, COLECAO_PRODUTOS));

  return produtos.docs.flatMap((documento) => {
    const dados = documento.data();
    if (!validarProduto(dados)) {
      console.warn(
        `Produto ${documento.id} ignorado porque está em um formato inválido.`,
        dados
      );
      return [];
    }

    return [
      {
        ...dados,
        id: documento.id,
        categoria: dados.categoria ?? 'feminino',
        imagens: dados.imagens ?? [],
        precoOriginal: String(dados.precoOriginal),
        precoDesconto: String(dados.precoDesconto),
        estoque: Number(dados.estoque),
      },
    ];
  });
}

export async function salvarProdutoCadastrado(
  produto: NovoProdutoCadastrado
): Promise<ProdutoCadastrado> {
  const referencia = doc(collection(db, COLECAO_PRODUTOS));
  await setDoc(referencia, produto);
  return { ...produto, id: referencia.id };
}

export async function removerProdutoCadastrado(id: string): Promise<void> {
  const referencia = doc(db, COLECAO_PRODUTOS, id);
  const produto = await getDoc(referencia);
  if (!produto.exists()) {
    throw new Error('O produto não foi encontrado no catálogo.');
  }

  await deleteDoc(referencia);
  await removerImagensProdutoLocal(id);
}

export async function atualizarImagemProduto(
  id: string,
  imagem: string,
  indice: number
): Promise<ProdutoCadastrado> {
  const referencia = doc(db, COLECAO_PRODUTOS, id);
  const snapshot = await getDoc(referencia);
  if (!snapshot.exists()) {
    throw new Error('O produto não foi encontrado no catálogo.');
  }
  const dados = snapshot.data();
  if (!validarProduto(dados)) {
    throw new Error('O produto não foi encontrado no catálogo.');
  }

  const produtoAtualizado: ProdutoCadastrado = {
    ...dados,
    id,
    categoria: dados.categoria ?? 'feminino',
    imagens: dados.imagens ?? [],
  };
  const imagens = [...produtoAtualizado.imagens];
  imagens[indice] = imagem;
  produtoAtualizado.imagens = imagens;
  await updateDoc(referencia, { imagens });

  return produtoAtualizado;
}

export async function atualizarProdutoCadastrado(
  id: string,
  dadosAtualizados: Partial<Omit<ProdutoCadastrado, 'id'>>
): Promise<ProdutoCadastrado> {
  const referencia = doc(db, COLECAO_PRODUTOS, id);
  const snapshot = await getDoc(referencia);
  if (!snapshot.exists()) {
    throw new Error('O produto não foi encontrado no catálogo.');
  }
  const dados = snapshot.data();
  if (!validarProduto(dados)) {
    throw new Error('O produto não foi encontrado no catálogo.');
  }

  const produtoAtualizado: ProdutoCadastrado = {
    ...dados,
    id,
    categoria: dados.categoria ?? 'feminino',
    ...dadosAtualizados,
    imagens: dadosAtualizados.imagens ?? dados.imagens ?? [],
  };
  await updateDoc(referencia, dadosAtualizados);

  return produtoAtualizado;
}

export async function buscarProdutoCadastrado(
  id: string
): Promise<ProdutoCadastrado | undefined> {
  const produto = await getDoc(doc(db, COLECAO_PRODUTOS, id));
  if (!produto.exists()) {
    return undefined;
  }

  const dados = produto.data();
  if (!validarProduto(dados)) {
    throw new Error(`O produto ${id} está em um formato inválido.`);
  }

  return {
    ...dados,
    id: produto.id,
    categoria: dados.categoria ?? 'feminino',
    imagens: dados.imagens ?? [],
    precoOriginal: String(dados.precoOriginal),
    precoDesconto: String(dados.precoDesconto),
    estoque: Number(dados.estoque),
  };
}
