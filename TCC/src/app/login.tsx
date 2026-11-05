
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from '../firebaseConfig';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erroLogin, setErroLogin] = useState('');

  // LOGIN COM E-MAIL E SENHA
  async function entrar() {
    if (!email.trim() || !senha) {
      setErroLogin('Digite seu e-mail e sua senha.');
      return;
    }

    try {
      setCarregando(true);
      setErroLogin('');

      await signInWithEmailAndPassword(
        auth,
        email.trim(),
        senha
      );

      router.replace('/home');
    } catch (erro: any) {
      console.log('ERRO DO LOGIN:', erro.code, erro.message);

      if (
        erro.code === 'auth/invalid-credential' ||
        erro.code === 'auth/wrong-password' ||
        erro.code === 'auth/user-not-found'
      ) {
        setErroLogin('E-mail ou senha incorretos.');
      } else if (erro.code === 'auth/invalid-email') {
        setErroLogin('Digite um e-mail válido.');
      } else if (erro.code === 'auth/too-many-requests') {
        setErroLogin('Muitas tentativas. Aguarde um pouco.');
      } else {
        setErroLogin('Não foi possível entrar. Tente novamente.');
      }
    } finally {
      setCarregando(false);
    }
  }

  // LOGIN COM GOOGLE NO NAVEGADOR
  async function entrarComGoogle() {
    if (Platform.OS !== 'web') {
      Alert.alert(
        'Login com Google',
        'O login nativo será configurado em outra etapa.'
      );
      return;
    }

    try {
      setCarregando(true);
      setErroLogin('');

      const provider = new GoogleAuthProvider();

      provider.setCustomParameters({
        prompt: 'select_account',
      });

      await signInWithPopup(auth, provider);

      router.replace('/home');
    } catch (erro: any) {
      console.log('ERRO GOOGLE:', erro.code, erro.message);

      if (erro.code === 'auth/popup-closed-by-user') {
        setErroLogin('Você fechou a janela do Google.');
      } else if (erro.code === 'auth/popup-blocked') {
        setErroLogin('O navegador bloqueou a janela. Permita pop-ups.');
      } else if (erro.code === 'auth/unauthorized-domain') {
        setErroLogin('Este domínio não está autorizado no Firebase.');
      } else {
        setErroLogin('Não foi possível entrar com o Google.');
      }
    } finally {
      setCarregando(false);
    }
  }

  // RECUPERAR SENHA
  async function recuperarSenha() {
    if (!email.trim()) {
      Alert.alert(
        'Recuperar senha',
        'Digite seu e-mail no campo acima primeiro.'
      );
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email.trim());

      Alert.alert(
        'E-mail enviado',
        'Se o endereço estiver cadastrado, você receberá as instruções para redefinir sua senha.'
      );
    } catch (erro: any) {
      if (erro.code === 'auth/invalid-email') {
        Alert.alert('Erro', 'Digite um e-mail válido.');
      } else {
        Alert.alert(
          'Atenção',
          'Não foi possível solicitar a recuperação. Confira o e-mail e tente novamente.'
        );
      }
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.pagina}
      keyboardShouldPersistTaps="handled"
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
      />

      <View style={styles.cabecalho}>
        <Text style={styles.logo}>BELLAVER</Text>
        <Text style={styles.estabelecimento}>EST. 1972</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.titulo}>Login</Text>

        <Text style={styles.label}>E-mail</Text>

        <TextInput
          style={styles.input}
          placeholder="Digite Seu E-mail.."
          placeholderTextColor="#888888"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Text style={styles.label}>Senha</Text>

        <View style={styles.campoSenha}>
          <TextInput
            style={styles.inputSenha}
            placeholder="Digite Sua Senha.."
            placeholderTextColor="#888888"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry={!mostrarSenha}
            autoCapitalize="none"
          />

          <TouchableOpacity
            onPress={() => setMostrarSenha(!mostrarSenha)}
            style={styles.botaoOlho}
          >
            <Ionicons
              name={
                mostrarSenha
                  ? 'eye-off-outline'
                  : 'eye-outline'
              }
              size={22}
              color="#555555"
            />
          </TouchableOpacity>
        </View>

        {erroLogin !== '' && (
          <Text style={styles.mensagemErro}>
            {erroLogin}
          </Text>
        )}

        <TouchableOpacity
          style={[
            styles.botao,
            carregando && { opacity: 0.6 },
          ]}
          onPress={entrar}
          disabled={carregando}
        >
          <Text style={styles.textoBotao}>
            {carregando ? 'Entrando...' : 'Entrar'}
          </Text>
        </TouchableOpacity>

        <View style={styles.linha} />

        <View style={styles.redesSociais}>
          <TouchableOpacity
            style={styles.botaoSocial}
            onPress={entrarComGoogle}
            disabled={carregando}
          >
            <Text style={styles.google}>G</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={recuperarSenha}>
          <Text style={styles.recuperar}>
            RECUPERAR SENHA
          </Text>
        </TouchableOpacity>

        <View style={styles.rodapeCard}>
          <Text style={styles.textoPequeno}>
            Não tem uma conta?{' '}
          </Text>

          <TouchableOpacity
            onPress={() => router.push('/cadastro1')}
          >
            <Text style={styles.link}>
              Registre-se Aqui
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.rodape}>
        Bellaver® - 2026
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  pagina: {
    flexGrow: 1,
    paddingHorizontal: 27,
    paddingTop: 90,
    paddingBottom: 45,
    justifyContent: 'space-between',
  },

  cabecalho: {
    alignItems: 'center',
    marginBottom: 68,
  },

  logo: {
    color: '#000000',
    fontSize: 30,
    fontWeight: '300',
    letterSpacing: 7,
  },

  estabelecimento: {
    color: '#000000',
    fontSize: 12,
    marginTop: 8,
  },

  card: {
    borderWidth: 1,
    borderColor: '#111111',
    borderRadius: 3,
    paddingHorizontal: 19,
    paddingTop: 10,
    paddingBottom: 28,
    backgroundColor: '#FFFFFF',
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 3,
  },

  titulo: {
    color: '#000000',
    fontSize: 32,
    fontWeight: '400',
    marginBottom: 22,
  },

  label: {
    color: '#111111',
    fontSize: 14,
    marginBottom: 7,
  },

  input: {
    height: 50,
    backgroundColor: '#EEEEEE',
    borderWidth: 1,
    borderColor: '#111111',
    borderRadius: 3,
    paddingHorizontal: 15,
    fontSize: 12,
    color: '#000000',
    marginBottom: 14,
  },

  campoSenha: {
    position: 'relative',
    justifyContent: 'center',
    marginBottom: 14,
  },

  inputSenha: {
    height: 50,
    backgroundColor: '#EEEEEE',
    borderWidth: 1,
    borderColor: '#111111',
    borderRadius: 3,
    paddingHorizontal: 15,
    paddingRight: 48,
    fontSize: 12,
    color: '#000000',
  },

  botaoOlho: {
    position: 'absolute',
    right: 12,
    height: 50,
    justifyContent: 'center',
  },

  botao: {
    backgroundColor: '#000000',
    width: 109,
    height: 37,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    marginTop: 20,
    marginBottom: 26,
  },

  textoBotao: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },

  linha: {
    height: 1,
    backgroundColor: '#BBBBBB',
    marginBottom: 20,
  },

  redesSociais: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 17,
    marginBottom: 23,
  },

  botaoSocial: {
    width: 53,
    height: 43,
    borderWidth: 1,
    borderColor: '#888888',
    borderRadius: 3,
    backgroundColor: '#F1F1F1',
    alignItems: 'center',
    justifyContent: 'center',
  },

  google: {
    color: '#000000',
    fontSize: 31,
    fontWeight: 'bold',
  },

  recuperar: {
    color: '#111111',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 25,
  },

  rodapeCard: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },

  textoPequeno: {
    color: '#111111',
    fontSize: 10,
  },

  link: {
    color: '#111111',
    fontSize: 10,
    textDecorationLine: 'underline',
  },

  rodape: {
    color: '#777777',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 80,
  },

  mensagemErro: {
    color: '#B00020',
    fontSize: 12,
    marginTop: -5,
    marginBottom: 10,
  },
});
