
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged } from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

function obterChaveLocal(uid?: string | null) {
  return `@bellaver/favoritos${uid ? `:${uid}` : ':anon'}`;
}

function normalizarListaFavoritos(valor: unknown): string[] {
  if (!Array.isArray(valor)) {
    return [];
  }

  return valor.filter(
    (item): item is string => typeof item === 'string'
  );
}

async function lerFavoritosLocais(
  uid?: string | null
): Promise<string[]> {
  try {
    const dados = await AsyncStorage.getItem(obterChaveLocal(uid));

    if (!dados) {
      return [];
    }

    return normalizarListaFavoritos(JSON.parse(dados));
  } catch {
    return [];
  }
}

async function salvarFavoritosLocais(
  ids: string[],
  uid?: string | null
): Promise<void> {
  try {
    await AsyncStorage.setItem(
      obterChaveLocal(uid),
      JSON.stringify(ids)
    );
  } catch {
    // Ignorar falha do armazenamento local.
  }
}

function ehErroPermissao(erro: unknown): boolean {
  if (!erro || typeof erro !== 'object') {
    return false;
  }

  const codigo =
    'code' in erro
      ? String((erro as { code?: string }).code)
      : '';

  const mensagem =
    'message' in erro
      ? String((erro as { message?: string }).message)
      : '';

  return (
    codigo === 'permission-denied' ||
    codigo === 'PERMISSION_DENIED' ||
    mensagem.toLowerCase().includes('permission') ||
    mensagem.toLowerCase().includes('insufficient permissions')
  );
}

export function useFavoritos() {
  const [favoritos, setFavoritos] = useState<string[]>([]);

  useEffect(() => {
    let cancelarFavoritos: (() => void) | null = null;
    let ativo = true;

    const cancelarAutenticacao = onAuthStateChanged(
      auth,
      async (usuario) => {
        cancelarFavoritos?.();
        cancelarFavoritos = null;

        const uid = usuario?.uid ?? null;

        const localInicial = await lerFavoritosLocais(uid);

        if (!ativo) {
          return;
        }

        setFavoritos(localInicial);

        if (!usuario) {
          return;
        }

        let primeiroSnapshot = true;

        cancelarFavoritos = onSnapshot(
          collection(db, 'usuarios', usuario.uid, 'favoritos'),

          async (snapshot) => {
            if (!ativo) {
              return;
            }

            const ids = snapshot.docs.map(
              (documento) => documento.id
            );

            // Evita que uma lista vazia do Firebase apague
            // os favoritos que já estavam salvos no celular.
            if (primeiroSnapshot) {
              primeiroSnapshot = false;

              if (ids.length === 0 && localInicial.length > 0) {
                setFavoritos(localInicial);

                await Promise.all(
                  localInicial.map((id) =>
                    setDoc(
                      doc(
                        db,
                        'usuarios',
                        usuario.uid,
                        'favoritos',
                        id
                      ),
                      {
                        produtoId: id,
                        criadoEm: serverTimestamp(),
                      }
                    )
                  )
                );

                await salvarFavoritosLocais(
                  localInicial,
                  usuario.uid
                );

                return;
              }
            }

            if (!ativo) {
              return;
            }

            setFavoritos(ids);

            void salvarFavoritosLocais(ids, usuario.uid);
          },

          async (erro: unknown) => {
            if (!ativo) {
              return;
            }

            if (ehErroPermissao(erro)) {
              const favoritosLocais =
                await lerFavoritosLocais(usuario.uid);

              if (ativo) {
                setFavoritos(favoritosLocais);
              }

              return;
            }

            console.error(
              'Erro ao carregar favoritos do Firestore:',
              erro
            );

            Alert.alert(
              'Erro ao carregar favoritos',
              'Não foi possível carregar seus favoritos salvos.'
            );
          }
        );
      }
    );

    return () => {
      ativo = false;
      cancelarFavoritos?.();
      cancelarAutenticacao();
    };
  }, []);

  async function alternarFavorito(id: string) {
    const usuario = auth.currentUser;

    if (!id.trim() || id.includes('/')) {
      Alert.alert(
        'Produto inválido',
        'Não foi possível salvar este favorito.'
      );
      return;
    }

    const jaEstaFavoritado = favoritos.includes(id);

    const idsAtuais = jaEstaFavoritado
      ? favoritos.filter((favoritoId) => favoritoId !== id)
      : [...favoritos, id];

    setFavoritos(idsAtuais);

    await salvarFavoritosLocais(
      idsAtuais,
      usuario?.uid ?? null
    );

    if (!usuario) {
      return;
    }

    const referencia = doc(
      db,
      'usuarios',
      usuario.uid,
      'favoritos',
      id
    );

    try {
      if (jaEstaFavoritado) {
        await deleteDoc(referencia);
      } else {
        await setDoc(referencia, {
          produtoId: id,
          criadoEm: serverTimestamp(),
        });
      }
    } catch (erro: unknown) {
      if (ehErroPermissao(erro)) {
        await salvarFavoritosLocais(idsAtuais, usuario.uid);
        return;
      }

      console.error(
        'Erro ao atualizar favoritos no Firestore:',
        erro
      );

      await salvarFavoritosLocais(idsAtuais, usuario.uid);

      Alert.alert(
        'Erro nos favoritos',
        'Não foi possível salvar sua alteração. Tente novamente.'
      );
    }
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
