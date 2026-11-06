import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE_FAVORITOS = '@bellaver/favoritos';

let listaFavoritos: string[] = [];
let carregamentoFavoritos: Promise<void> | null = null;
let filaPersistencia: Promise<void> = Promise.resolve();

const ouvintes = new Set<(lista: string[]) => void>();

function atualizarFavoritos(novaLista: string[]) {
  listaFavoritos = novaLista;
  ouvintes.forEach((ouvinte) => ouvinte([...listaFavoritos]));
}

function carregarFavoritos() {
  if (!carregamentoFavoritos) {
    carregamentoFavoritos = AsyncStorage.getItem(CHAVE_FAVORITOS)
      .then((dados) => {
        const favoritosSalvos: unknown = dados ? JSON.parse(dados) : [];

        if (
          !Array.isArray(favoritosSalvos) ||
          !favoritosSalvos.every((id) => typeof id === 'string')
        ) {
          throw new Error('Os dados de favoritos salvos estão inválidos.');
        }

        atualizarFavoritos(favoritosSalvos);
      })
      .catch((erro: unknown) => {
        carregamentoFavoritos = null;
        throw erro;
      });
  }

  return carregamentoFavoritos;
}

function persistirFavoritos() {
  const dados = JSON.stringify(listaFavoritos);
  const gravacao = filaPersistencia
    .catch(() => undefined)
    .then(() => AsyncStorage.setItem(CHAVE_FAVORITOS, dados));

  filaPersistencia = gravacao;
  return gravacao;
}

export function useFavoritos() {
  const [favoritos, setFavoritos] = useState<string[]>([
    ...listaFavoritos,
  ]);

  useEffect(() => {
    ouvintes.add(setFavoritos);

    carregarFavoritos().catch((erro: unknown) => {
      console.error('Erro ao carregar favoritos salvos:', erro);
      Alert.alert(
        'Erro ao carregar favoritos',
        'Não foi possível carregar seus favoritos salvos.'
      );
    });

    return () => {
      ouvintes.delete(setFavoritos);
    };
  }, []);

  function alternarFavorito(id: string) {
    carregarFavoritos()
      .then(() => {
        const novaLista = listaFavoritos.includes(id)
          ? listaFavoritos.filter((item) => item !== id)
          : [...listaFavoritos, id];

        atualizarFavoritos(novaLista);
        return persistirFavoritos();
      })
      .catch((erro: unknown) => {
        console.error('Erro ao atualizar favoritos:', erro);
        Alert.alert(
          'Erro nos favoritos',
          'Não foi possível salvar sua alteração. Tente novamente.'
        );
      });
  }

  function verificarFavorito(id: string) {
    return favoritos.includes(id);
  }

  return {
    favoritos,
    alternarFavorito,
    verificarFavorito,
  };
}
