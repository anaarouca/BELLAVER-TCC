import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Redirect, type Href } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { ADMIN_EMAIL, getUserRole } from '../auth/session';
import { auth } from '../firebaseConfig';

export default function IndexScreen() {
  const [rotaInicial, setRotaInicial] = useState<Href | null>(null);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    let ativo = true;

    const unsubscribe = onAuthStateChanged(auth, (usuario) => {
      if (!usuario) {
        if (ativo) {
          setRotaInicial('/splash');
        }
        return;
      }

      getUserRole()
        .then((perfil) => {
          if (ativo) {
            const administrador =
              perfil === 'admin' ||
              usuario.email?.toLowerCase() === ADMIN_EMAIL;
            setRotaInicial(administrador ? '/cadProduto' : '/home');
          }
        })
        .catch((erroCarregamento: unknown) => {
          console.error('Erro ao restaurar perfil da sessão:', erroCarregamento);
          if (ativo) {
            setErro(true);
          }
        });
    });

    return () => {
      ativo = false;
      unsubscribe();
    };
  }, []);

  if (rotaInicial) {
    return <Redirect href={rotaInicial} />;
  }

  return (
    <View style={styles.container}>
      {erro ? (
        <Text style={styles.erro}>
          Não foi possível restaurar sua sessão. Reinicie o aplicativo.
        </Text>
      ) : (
        <ActivityIndicator color="#111111" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
  },
  erro: {
    color: '#111111',
    textAlign: 'center',
  },
});
