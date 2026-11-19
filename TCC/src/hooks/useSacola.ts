import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged } from 'firebase/auth';
import {
  collection,
  doc,
  onSnapshot,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

export type ItemSacola = {
  id: string;
  produtoId: string;
  nome: string;
  preco: number;
  precoAntigo?: number;
  tamanho: string;
  imagem: string;
  quantidade: number;
  estoque: number;
};

type DadosProdutoLocal = {
  nome: string;
  preco: number | string;
  precoAntigo?: number | string;
  imagem: string;
  estoque: number;
};

function obterChaveLocal(uid?: string | null) {
  return `@bellaver/sacola${uid ? `:${uid}` : ':anon'}`;
}

function normalizarItens(valor: unknown): ItemSacola[] {
  if (!Array.isArray(valor)) {
    return [];
  }

  return valor.filter((item): item is ItemSacola => {
    return (
      !!item &&
      typeof item === 'object' &&
      typeof item.id === 'string' &&
      typeof item.produtoId === 'string' &&
      typeof item.nome === 'string' &&
      typeof item.preco === 'number' &&
      typeof item.quantidade === 'number' &&
      typeof item.estoque === 'number' &&
      typeof item.tamanho === 'string' &&
      typeof item.imagem === 'string' &&
      !(
        item.nome === item.produtoId &&
        item.preco === 0 &&
        item.imagem === ''
      )
    );
  });
}

async function lerSacolaLocal(uid?: string | null): Promise<ItemSacola[]> {
  try {
    const dados = await AsyncStorage.getItem(obterChaveLocal(uid));
    if (!dados) {
      return [];
    }

    const valor: unknown = JSON.parse(dados);
    const itens = normalizarItens(valor);
    if (!Array.isArray(valor) || itens.length !== valor.length) {
      await AsyncStorage.setItem(
        obterChaveLocal(uid),
        JSON.stringify(itens)
      );
    }
    return itens;
  } catch {
    return [];
  }
}

async function salvarSacolaLocal(
  itens: ItemSacola[],
  uid?: string | null
): Promise<void> {
  try {
    await AsyncStorage.setItem(
      obterChaveLocal(uid),
      JSON.stringify(itens)
    );
  } catch {
    // Ignorar falha do armazenamento local.
  }
}

function ehErroPermissao(erro: unknown): boolean {
  if (!erro || typeof erro !== 'object') {
    return false;
  }

  const codigo = 'code' in erro ? String((erro as { code?: string }).code) : '';
  const mensagem =
    'message' in erro ? String((erro as { message?: string }).message) : '';

  return (
    codigo === 'permission-denied' ||
    codigo === 'PERMISSION_DENIED' ||
    mensagem.toLowerCase().includes('permission') ||
    mensagem.toLowerCase().includes('insufficient permissions')
  );
}

function converterPreco(valor: unknown): number {
  if (typeof valor === 'number') {
    return Number.isFinite(valor) ? valor : 0;
  }

  if (typeof valor !== 'string') {
    return 0;
  }

  const numero = Number(
    valor.replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.')
  );
  return Number.isFinite(numero) ? numero : 0;
}

function lerQuantidades(valor: unknown): Record<string, number> {
  if (!valor || typeof valor !== 'object' || Array.isArray(valor)) {
    return {};
  }

  const quantidades: Record<string, number> = {};
  Object.entries(valor).forEach(([tamanho, quantidade]) => {
    if (typeof quantidade === 'number' && Number.isInteger(quantidade)) {
      quantidades[tamanho] = quantidade;
    }
  });
  return quantidades;
}

function lerItens(
  produtoId: string,
  dados: Record<string, unknown>
): ItemSacola[] {
  const nome = dados.nome;
  const estoque = dados.estoque;
  if (typeof nome !== 'string' || typeof estoque !== 'number') {
    return [];
  }

  const quantidades = lerQuantidades(dados.quantidadesPorTamanho);
  return Object.entries(quantidades).map(([tamanho, quantidade]) => ({
    id: `${produtoId}_${encodeURIComponent(tamanho)}`,
    produtoId,
    nome,
    preco: converterPreco(dados.preco),
    precoAntigo:
      dados.precoAntigo === undefined
        ? undefined
        : converterPreco(dados.precoAntigo),
    tamanho: tamanho === 'unico' ? '' : tamanho,
    imagem: typeof dados.imagem === 'string' ? dados.imagem : '',
    quantidade,
    estoque,
  }));
}

export function useSacola() {
  const [itens, setItens] = useState<ItemSacola[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [modoLocal, setModoLocal] = useState(false);

  useEffect(() => {
    let cancelarSacola: (() => void) | null = null;
    let ativo = true;

    const cancelarAutenticacao = onAuthStateChanged(auth, async (usuario) => {
      cancelarSacola?.();
      cancelarSacola = null;

      const locais = await lerSacolaLocal(usuario?.uid ?? null);
      if (ativo) {
        setItens(locais);
      }

      if (!usuario) {
        setModoLocal(true);
        setCarregando(false);
        return;
      }

      setModoLocal(false);
      setCarregando(true);
      cancelarSacola = onSnapshot(
        collection(db, 'usuarios', usuario.uid, 'sacola'),
        (snapshot) => {
          if (!ativo) {
            return;
          }

          const itensCarregados = snapshot.docs.flatMap((documento) =>
            lerItens(documento.id, documento.data())
          );

          setItens(itensCarregados);
          setModoLocal(false);
          void salvarSacolaLocal(itensCarregados, usuario.uid);
          setCarregando(false);
        },
        async (erro: unknown) => {
          if (ehErroPermissao(erro) && ativo) {
            const itensLocais = await lerSacolaLocal(usuario.uid);
            setItens(itensLocais);
            setModoLocal(true);
            setCarregando(false);
            return;
          }

          if (ativo) {
            console.error('Erro ao carregar sacola do Firestore:', erro);
            setCarregando(false);
            Alert.alert(
              'Erro ao carregar sacola',
              'Não foi possível carregar os produtos da sua sacola.'
            );
          }
        }
      );
    });

    return () => {
      ativo = false;
      cancelarSacola?.();
      cancelarAutenticacao();
    };
  }, []);

  async function adicionarProduto(
    produtoId: string,
    tamanho: string,
    quantidade: number,
    dadosProdutoLocal?: DadosProdutoLocal
  ) {
    const usuario = auth.currentUser;
    if (!usuario) {
      throw new Error('Faça login para adicionar produtos à sacola.');
    }
    const uid = usuario.uid;

    if (!Number.isInteger(quantidade) || quantidade < 1) {
      throw new Error('Informe uma quantidade válida.');
    }

    async function adicionarLocalmente() {
      const itensLocais = await lerSacolaLocal(uid);
      const chaveTamanho = tamanho || 'unico';
      const itemExistente = itensLocais.find(
        (item) => item.produtoId === produtoId && item.tamanho === tamanho
      );
      const dados = dadosProdutoLocal ?? itemExistente;

      if (!dados) {
        throw new Error(
          'Não foi possível carregar os dados deste produto para a sacola.'
        );
      }

      const quantidadeNova = (itemExistente?.quantidade ?? 0) + quantidade;

      const itemAtualizado: ItemSacola = {
        id: `${produtoId}_${encodeURIComponent(chaveTamanho)}`,
        produtoId,
        nome: dados.nome,
        preco: converterPreco(dados.preco),
        precoAntigo:
          dados.precoAntigo === undefined
            ? undefined
            : converterPreco(dados.precoAntigo),
        tamanho,
        imagem: dados.imagem,
        quantidade: quantidadeNova,
        estoque: dados.estoque,
      };
      const itensAtualizados = itemExistente
        ? itensLocais.map((item) =>
            item.id === itemExistente.id ? itemAtualizado : item
          )
        : [...itensLocais, itemAtualizado];

      setItens(itensAtualizados);
      await salvarSacolaLocal(itensAtualizados, uid);
    }

    if (modoLocal) {
      await adicionarLocalmente();
      return;
    }

    const sacola = collection(db, 'usuarios', usuario.uid, 'sacola');
    const produtoRef = doc(db, 'produtos', produtoId);
    const itemRef = doc(sacola, produtoId);

    try {
      await runTransaction(db, async (transacao) => {
        const [produtoSnapshot, itemSnapshot] = await Promise.all([
          transacao.get(produtoRef),
          transacao.get(itemRef),
        ]);

        if (!produtoSnapshot.exists()) {
          throw new Error('Este produto não está disponível no catálogo.');
        }

        const produto = produtoSnapshot.data();
        const estoque = Number(produto.estoque);
        const tamanhos = Array.isArray(produto.tamanhos)
          ? produto.tamanhos.filter(
              (item): item is string => typeof item === 'string'
            )
          : [];

        if (!Number.isInteger(estoque) || estoque <= 0) {
          throw new Error('Este produto está sem estoque.');
        }

        if (
          (tamanhos.length > 0 && !tamanho) ||
          (tamanho && !tamanhos.includes(tamanho))
        ) {
          throw new Error('Selecione um tamanho disponível para este produto.');
        }

        const tamanhoChave = tamanho || 'unico';
        const quantidades = lerQuantidades(
          itemSnapshot.data()?.quantidadesPorTamanho
        );
        const quantidadeTotal = Object.values(quantidades).reduce(
          (total, atual) => total + atual,
          0
        );
        if (quantidadeTotal + quantidade > estoque) {
          throw new Error(
            `Há apenas ${Math.max(0, estoque - quantidadeTotal)} unidade(s) disponíveis.`
          );
        }

        transacao.set(itemRef, {
          produtoId,
          nome: produto.nome,
          preco: produto.precoDesconto,
          precoAntigo: produto.precoOriginal,
          imagem: Array.isArray(produto.imagens)
            ? produto.imagens[0] ?? ''
            : '',
          quantidadesPorTamanho: {
            ...quantidades,
            [tamanhoChave]: (quantidades[tamanhoChave] ?? 0) + quantidade,
          },
          estoque,
          atualizadoEm: serverTimestamp(),
        });
      });
    } catch (erro: unknown) {
      if (ehErroPermissao(erro)) {
        setModoLocal(true);
        await adicionarLocalmente();
        return;
      }

      throw erro;
    }
  }

  async function alterarQuantidade(
    produtoId: string,
    tamanho: string,
    quantidade: number
  ) {
    const usuario = auth.currentUser;
    if (!usuario) {
      throw new Error('Faça login para alterar sua sacola.');
    }
    const uid = usuario.uid;

    if (!Number.isInteger(quantidade) || quantidade < 1) {
      throw new Error('Informe uma quantidade válida.');
    }

    if (modoLocal) {
      const itensAtualizados = itens.map((item) =>
        item.produtoId === produtoId && item.tamanho === tamanho
          ? { ...item, quantidade }
          : item
      );
      setItens(itensAtualizados);
      await salvarSacolaLocal(itensAtualizados, uid);
      return;
    }

    const sacola = collection(db, 'usuarios', usuario.uid, 'sacola');
    const itemRef = doc(sacola, produtoId);

    try {
      await runTransaction(db, async (transacao) => {
        const [itemSnapshot, produtoSnapshot] = await Promise.all([
          transacao.get(itemRef),
          transacao.get(doc(db, 'produtos', produtoId)),
        ]);
        if (!itemSnapshot.exists() || !produtoSnapshot.exists()) {
          throw new Error('Este item não está mais na sua sacola.');
        }

        const estoque = Number(produtoSnapshot.data().estoque);
        const tamanhoChave = tamanho || 'unico';
        const quantidades = lerQuantidades(
          itemSnapshot.data().quantidadesPorTamanho
        );
        if (quantidades[tamanhoChave] === undefined) {
          throw new Error('Este tamanho não está mais na sua sacola.');
        }

        const totalDosOutrosTamanhos = Object.entries(quantidades).reduce(
          (total, [chave, atual]) =>
            total + (chave === tamanhoChave ? 0 : atual),
          0
        );
        if (quantidade + totalDosOutrosTamanhos > estoque) {
          throw new Error(
            `A quantidade solicitada excede o estoque disponível (${estoque}).`
          );
        }

        transacao.update(itemRef, {
          [`quantidadesPorTamanho.${tamanhoChave}`]: quantidade,
          estoque,
          atualizadoEm: serverTimestamp(),
        });
      });
    } catch (erro: unknown) {
      if (ehErroPermissao(erro)) {
        setModoLocal(true);
        const itensAtualizados = itens.map((item) =>
          item.produtoId === produtoId && item.tamanho === tamanho
            ? { ...item, quantidade }
            : item
        );
        setItens(itensAtualizados);
        await salvarSacolaLocal(itensAtualizados, usuario.uid);
        return;
      }

      throw erro;
    }
  }

  async function removerProduto(produtoId: string, tamanho: string) {
    const usuario = auth.currentUser;
    if (!usuario) {
      throw new Error('Faça login para alterar sua sacola.');
    }

    const itemRef = doc(db, 'usuarios', usuario.uid, 'sacola', produtoId);

    if (modoLocal) {
      const itensAtualizados = itens.filter(
        (item) => !(item.produtoId === produtoId && item.tamanho === tamanho)
      );
      setItens(itensAtualizados);
      await salvarSacolaLocal(itensAtualizados, usuario.uid);
      return;
    }

    try {
      await runTransaction(db, async (transacao) => {
        const itemSnapshot = await transacao.get(itemRef);
        if (!itemSnapshot.exists()) {
          return;
        }

        const quantidades = lerQuantidades(
          itemSnapshot.data().quantidadesPorTamanho
        );
        delete quantidades[tamanho || 'unico'];

        if (Object.keys(quantidades).length === 0) {
          transacao.delete(itemRef);
        } else {
          transacao.update(itemRef, {
            quantidadesPorTamanho: quantidades,
            atualizadoEm: serverTimestamp(),
          });
        }
      });
    } catch (erro: unknown) {
      if (ehErroPermissao(erro)) {
        setModoLocal(true);
        const itensAtualizados = itens.filter(
          (item) => !(item.produtoId === produtoId && item.tamanho === tamanho)
        );
        setItens(itensAtualizados);
        await salvarSacolaLocal(itensAtualizados, usuario.uid);
        return;
      }

      throw erro;
    }
  }

  async function finalizarCompra(): Promise<void> {
    const usuario = auth.currentUser;
    if (!usuario) {
      throw new Error('Faça login para finalizar a compra.');
    }

    if (itens.length === 0) {
      throw new Error('Sua sacola está vazia.');
    }

    const quantidadesPorProduto = new Map<string, number>();
    itens.forEach((item) => {
      quantidadesPorProduto.set(
        item.produtoId,
        (quantidadesPorProduto.get(item.produtoId) ?? 0) + item.quantidade
      );
    });

    if (modoLocal) {
      setItens([]);
      await salvarSacolaLocal([], usuario.uid);
      return;
    }

    const sacola = collection(db, 'usuarios', usuario.uid, 'sacola');

    try {
      await runTransaction(db, async (transacao) => {
        const produtos = Array.from(quantidadesPorProduto.entries());
        const snapshots = await Promise.all(
          produtos.map(([produtoId]) =>
            transacao.get(doc(db, 'produtos', produtoId))
          )
        );

        snapshots.forEach((snapshot, indice) => {
          if (!snapshot.exists()) {
            throw new Error('Um dos produtos não está mais disponível.');
          }

          const estoque = Number(snapshot.data().estoque);
          const quantidade = produtos[indice][1];
          if (!Number.isInteger(estoque) || estoque < quantidade) {
            throw new Error(
              `Estoque insuficiente para ${snapshot.data().nome ?? 'um produto'}.`
            );
          }

          transacao.update(snapshot.ref, {
            estoque: estoque - quantidade,
            atualizadoEm: serverTimestamp(),
          });
        });

        Array.from(quantidadesPorProduto.keys()).forEach((produtoId) => {
          transacao.delete(doc(sacola, produtoId));
        });
      });

      setItens([]);
      await salvarSacolaLocal([], usuario.uid);
    } catch (erro: unknown) {
      if (ehErroPermissao(erro)) {
        setModoLocal(true);
        setItens([]);
        await salvarSacolaLocal([], usuario.uid);
        return;
      }

      throw erro;
    }
  }

  return {
    itens,
    carregando,
    adicionarProduto,
    alterarQuantidade,
    removerProduto,
    finalizarCompra,
  };
}
