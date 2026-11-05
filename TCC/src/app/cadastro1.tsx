import { useState } from 'react';
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
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from '../firebaseConfig';

export default function CadastroScreen() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [confirmarEmail, setConfirmarEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erroCadastro, setErroCadastro] = useState('');

  async function registrarComGoogle() {
    if (Platform.OS !== 'web') {
      Alert.alert(
        'Cadastro com Google',
        'O cadastro nativo com Google será configurado na próxima etapa.'
      );
      return;
    }

    try {
      setCarregando(true);
      setErroCadastro('');

      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account',
      });

      await signInWithPopup(auth, provider);
      router.replace('/home');
    } catch (erro: any) {
      console.log('ERRO GOOGLE NO CADASTRO:', erro.code, erro.message);

      if (erro.code === 'auth/popup-closed-by-user') {
        setErroCadastro('Você fechou a janela do Google.');
      } else if (erro.code === 'auth/popup-blocked') {
        setErroCadastro('O navegador bloqueou a janela. Permita pop-ups.');
      } else {
        setErroCadastro('Não foi possível cadastrar com o Google.');
      }
    } finally {
      setCarregando(false);
    }
  }

  async function registrar() {
    setErroCadastro('');

    if (
      !nome.trim() ||
      !email.trim() ||
      !confirmarEmail.trim() ||
      !senha ||
      !confirmarSenha
    ) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }

    if (email.trim().toLowerCase() !== confirmarEmail.trim().toLowerCase()) {
      Alert.alert('Atenção', 'Os e-mails não coincidem.');
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert('Atenção', 'As senhas não coincidem.');
      return;
    }

    if (senha.length < 6) {
      Alert.alert('Atenção', 'A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    try {
      setCarregando(true);

      const resultado = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        senha
      );

      await updateProfile(resultado.user, {
        displayName: nome.trim(),
      });

      Alert.alert(
        'Cadastro realizado!',
        'Sua conta Bellaver foi criada com sucesso.',
        [
          {
            text: 'Ir para o login',
            onPress: () => router.replace('/login'),
          },
        ]
      );
    } catch (erro: any) {
      if (erro.code === 'auth/email-already-in-use') {
        Alert.alert('Atenção', 'Este e-mail já está cadastrado.');
      } else if (erro.code === 'auth/invalid-email') {
        Alert.alert('Atenção', 'Digite um endereço de e-mail válido.');
      } else if (erro.code === 'auth/weak-password') {
        Alert.alert('Atenção', 'Escolha uma senha mais segura.');
      } else if (erro.code === 'auth/network-request-failed') {
        Alert.alert('Erro de conexão', 'Verifique sua internet e tente novamente.');
      } else {
        Alert.alert('Erro', 'Não foi possível criar a conta. Tente novamente.');
        console.log('Erro no cadastro:', erro.code, erro.message);
      }
    } finally {
      setCarregando(false);
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.pagina}
      keyboardShouldPersistTaps="handled"
    >
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.cabecalho}>
        <Text style={styles.logo}>BELLAVER</Text>
        <Text style={styles.estabelecimento}>EST. 1972</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.titulo}>CRIAR CONTA</Text>
        <Text style={styles.subtitulo}>
          Preencha seus dados para fazer parte da Bellaver.
        </Text>

        <Text style={styles.label}>Nome completo</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite seu nome completo"
          placeholderTextColor="#888888"
          value={nome}
          onChangeText={setNome}
          autoCapitalize="words"
        />

        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite seu e-mail"
          placeholderTextColor="#888888"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Text style={styles.label}>Confirmar e-mail</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite seu e-mail novamente"
          placeholderTextColor="#888888"
          value={confirmarEmail}
          onChangeText={setConfirmarEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite sua senha"
          placeholderTextColor="#888888"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          autoCapitalize="none"
        />

        <Text style={styles.label}>Confirmar senha</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite sua senha novamente"
          placeholderTextColor="#888888"
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
          secureTextEntry
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={[styles.botao, carregando && { opacity: 0.6 }]}
          onPress={registrar}
          disabled={carregando}
        >
          <Text style={styles.textoBotao}>
            {carregando ? 'Registrando...' : 'Registrar'}
          </Text>
        </TouchableOpacity>

        {erroCadastro !== '' && (
          <Text style={styles.mensagemErro}>
            {erroCadastro}
          </Text>
        )}

        <View style={styles.linha} />

        <Text style={styles.textoSocial}>Ou cadastre-se com</Text>

        <View style={styles.redesSociais}>
          <TouchableOpacity
            style={[styles.botaoSocial, carregando && { opacity: 0.6 }]}
            onPress={registrarComGoogle}
            disabled={carregando}
          >
            <Text style={styles.google}>G</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.rodapeCard}>
          <Text style={styles.textoPequeno}>Já tem uma conta? </Text>
          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text style={styles.link}>Faça Login</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.rodape}>Bellaver® - 2026</Text>
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
    paddingHorizontal: 22,
    paddingTop: 45,
    paddingBottom: 25,
    alignItems: 'center',
  },
  cabecalho: {
    alignItems: 'center',
    marginBottom: 30,
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
    width: '100%',
    maxWidth: 480,
    borderWidth: 1,
    borderColor: '#111111',
    borderRadius: 3,
    paddingHorizontal: 22,
    paddingTop: 25,
    paddingBottom: 25,
    backgroundColor: '#FFFFFF',
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 3,
  },
  titulo: {
    color: '#111111',
    fontSize: 17,
    fontWeight: '400',
    textAlign: 'center',
    letterSpacing: 3,
  },
  subtitulo: {
    color: '#777777',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  label: {
    color: '#111111',
    fontSize: 13,
    marginBottom: 6,
  },
  input: {
    height: 43,
    backgroundColor: '#EEEEEE',
    borderWidth: 1,
    borderColor: '#BBBBBB',
    borderRadius: 3,
    paddingHorizontal: 12,
    paddingVertical: 0,
    fontSize: 12,
    color: '#000000',
    marginBottom: 16,
  },
  botao: {
    backgroundColor: '#000000',
    width: '100%',
    height: 43,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    marginTop: 8,
    marginBottom: 20,
  },
  textoBotao: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  linha: {
    height: 1,
    backgroundColor: '#BBBBBB',
    marginBottom: 15,
  },
  textoSocial: {
    color: '#777777',
    fontSize: 11,
    textAlign: 'center',
  },
  redesSociais: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 13,
    marginBottom: 22,
  },
  botaoSocial: {
    width: 45,
    height: 40,
    borderWidth: 1,
    borderColor: '#BBBBBB',
    borderRadius: 3,
    backgroundColor: '#F1F1F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  google: {
    color: '#000000',
    fontSize: 27,
    fontWeight: 'bold',
  },
  mensagemErro: {
    color: '#B00020',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 12,
  },
  rodapeCard: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  textoPequeno: {
    color: '#111111',
    fontSize: 11,
  },
  link: {
    color: '#111111',
    fontSize: 11,
    textDecorationLine: 'underline',
  },
  rodape: {
    color: '#777777',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 28,
  },
});