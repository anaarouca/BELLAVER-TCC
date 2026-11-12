import { useState } from 'react';
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import {
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from '../firebaseConfig';
import {
  ADMIN_EMAIL,
  clearUserRole,
  saveUserRole,
} from '../auth/session';

export default function LoginAdmScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erroLogin, setErroLogin] = useState('');

  async function entrar() {
    if (!email.trim() || !senha) {
      setErroLogin('Digite seu e-mail e sua senha.');
      return;
    }

    if (email.trim().toLowerCase() !== ADMIN_EMAIL) {
      setErroLogin('Credenciais de administrador inválidas.');
      Alert.alert('Acesso negado', 'Este login não é válido para o administrador.');
      return;
    }

    try {
      const credencial = await signInWithEmailAndPassword(auth, ADMIN_EMAIL, senha);
      if (!credencial.user.emailVerified) {
        await sendEmailVerification(credencial.user);
        await signOut(auth);
        await clearUserRole();
        setErroLogin('Enviamos um link para verificar o e-mail do administrador.');
        Alert.alert(
          'Verificação necessária',
          'Abra o link enviado para o e-mail do administrador e entre novamente.'
        );
        return;
      }

      await saveUserRole('admin');
      router.replace('/catalogo');
    } catch (erro: unknown) {
      console.error('Erro ao autenticar administrador:', erro);
      const codigoErro =
        erro &&
        typeof erro === 'object' &&
        'code' in erro &&
        typeof erro.code === 'string'
          ? erro.code
          : '';
      const mensagem =
        codigoErro === 'auth/invalid-credential' ||
        codigoErro === 'auth/user-not-found' ||
        codigoErro === 'auth/wrong-password'
          ? `A conta ${ADMIN_EMAIL} não foi encontrada ou a senha está incorreta. Confira a conta no Firebase Authentication ou redefina a senha.`
          : codigoErro === 'auth/operation-not-allowed'
            ? 'O login por e-mail e senha não está habilitado no Firebase Authentication.'
            : 'Não foi possível autenticar o administrador. Verifique a conexão e tente novamente.';
      setErroLogin(mensagem);
      Alert.alert(
        'Acesso negado',
        mensagem
      );
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      <View style={styles.wrapper}>
        <Text style={styles.brand}>BELLAVER</Text>
        <Text style={styles.estabelecimento}>EST. 1972</Text>

        <View style={styles.lineTop} />

        <Text style={styles.title}>Login - Administrador</Text>

        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite Seu E-mail.."
          placeholderTextColor="#8b8b8b"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite Sua Senha.."
          placeholderTextColor="#8b8b8b"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          autoCapitalize="none"
        />

        {erroLogin ? <Text style={styles.erro}>{erroLogin}</Text> : null}

        <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={entrar}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: '/recuperar-senha',
              params: { origem: 'admin', email: ADMIN_EMAIL },
            })
          }
          accessibilityRole="button"
          accessibilityLabel="Recuperar senha do administrador"
        >
          <Text style={styles.recuperarSenha}>ESQUECI A SENHA</Text>
        </TouchableOpacity>

        <View style={styles.lineBottom} />

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.replace('/login')}
          accessibilityRole="button"
          accessibilityLabel="Voltar para login"
        >
          <Text style={styles.backToLogin}>VOLTAR PARA LOGIN</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>Bellaver® - 2026</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },

  content: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 27,
    paddingTop: 24,
    paddingBottom: 24,
  },

  wrapper: {
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    justifyContent: 'center',
  },

  brand: {
    color: '#F2F2F2',
    fontSize: 30,
    fontWeight: '300',
    letterSpacing: 6,
    marginTop: 0,
    marginBottom: 2,
    fontFamily: 'System',
    textTransform: 'uppercase',
  },

  estabelecimento: {
    color: '#F2F2F2',
    fontSize: 12,
    letterSpacing: 1.1,
    marginTop: 0,
    marginBottom: 12,
  },

  lineTop: {
    width: '100%',
    height: 1,
    backgroundColor: '#D9D9D9',
    marginBottom: 16,
  },

  title: {
    width: '100%',
    color: '#F2F2F2',
    fontSize: 28,
    fontWeight: '400',
    marginBottom: 16,
    textAlign: 'left',
  },

  label: {
    width: '100%',
    color: '#F2F2F2',
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'left',
  },

  input: {
    width: '100%',
    height: 44,
    backgroundColor: '#dedede',
    borderRadius: 4,
    paddingHorizontal: 14,
    color: '#111111',
    fontSize: 14,
    marginBottom: 16,
  },

  button: {
    width: '100%',
    height: 42,
    backgroundColor: '#cfcfcf',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 18,
  },

  erro: {
    width: '100%',
    color: '#ff9a9a',
    fontSize: 12,
    marginBottom: 8,
    textAlign: 'left',
  },

  buttonText: {
    color: '#111111',
    fontSize: 18,
    fontWeight: '600',
  },
  recuperarSenha: {
    color: '#F2F2F2',
    fontSize: 12,
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginBottom: 18,
  },

  lineBottom: {
    width: '100%',
    height: 1,
    backgroundColor: '#D9D9D9',
    marginBottom: 18,
  },

  backToLogin: {
    color: '#F2F2F2',
    fontSize: 12,
    textAlign: 'center',
    letterSpacing: 0.7,
    marginBottom: 24,
  },

  footer: {
    color: '#a3a3a3',
    fontSize: 10,
    marginTop: 24,
  },
});
