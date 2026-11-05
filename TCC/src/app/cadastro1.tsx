
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
  const [sobrenome, setSobrenome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [rua, setRua] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
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
      !sobrenome.trim() ||
      !email.trim() ||
      !telefone.trim() ||
      !rua.trim() ||
      !bairro.trim() ||
      !cidade.trim() ||
      !estado.trim() ||
      !senha ||
      !confirmarSenha
    ) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
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
        displayName: `${nome.trim()} ${sobrenome.trim()}`,
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
        <Text style={styles.label}>Nome</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite Seu Nome.."
          placeholderTextColor="#888888"
          value={nome}
          onChangeText={setNome}
        />

        <Text style={styles.label}>Sobrenome</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite Seu Sobrenome.."
          placeholderTextColor="#888888"
          value={sobrenome}
          onChangeText={setSobrenome}
        />

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

        <Text style={styles.label}>Telefone Celular</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite Seu Celular.."
          placeholderTextColor="#888888"
          value={telefone}
          onChangeText={setTelefone}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Rua</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite Sua Rua.."
          placeholderTextColor="#888888"
          value={rua}
          onChangeText={setRua}
        />

        <Text style={styles.label}>Bairro</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite Seu Bairro.."
          placeholderTextColor="#888888"
          value={bairro}
          onChangeText={setBairro}
        />

        <Text style={styles.label}>Cidade</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite Sua Cidade.."
          placeholderTextColor="#888888"
          value={cidade}
          onChangeText={setCidade}
        />

        <Text style={styles.label}>Estado</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite Seu Estado.."
          placeholderTextColor="#888888"
          value={estado}
          onChangeText={setEstado}
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite Sua Senha..."
          placeholderTextColor="#888888"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          autoCapitalize="none"
        />

        <Text style={styles.label}>Confirmar Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite Sua Senha Novamente..."
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

        <View style={styles.linha} />

        {erroCadastro !== '' && (
          <Text style={styles.mensagemErro}>
            {erroCadastro}
          </Text>
        )}

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
    paddingTop: 55,
    paddingBottom: 25,
  },

  cabecalho: {
    alignItems: 'center',
    marginBottom: 45,
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
    paddingHorizontal: 16,
    paddingTop: 19,
    paddingBottom: 25,
    backgroundColor: '#FFFFFF',
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 3,
  },

  label: {
    color: '#111111',
    fontSize: 14,
    marginBottom: 5,
  },

  input: {
    height: 42,
    backgroundColor: '#EEEEEE',
    borderWidth: 1,
    borderColor: '#111111',
    borderRadius: 3,
    paddingHorizontal: 10,
    paddingVertical: 0,
    fontSize: 11,
    color: '#000000',
    marginBottom: 12,
  },

  botao: {
    backgroundColor: '#000000',
    width: 109,
    height: 37,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    marginTop: 14,
    marginBottom: 22,
  },

  textoBotao: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },

  linha: {
    height: 1,
    backgroundColor: '#BBBBBB',
    marginBottom: 12,
  },

  redesSociais: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 17,
    marginBottom: 25,
  },

  botaoSocial: {
    width: 53,
    height: 42,
    borderWidth: 1,
    borderColor: '#888888',
    borderRadius: 3,
    backgroundColor: '#F1F1F1',
    alignItems: 'center',
    justifyContent: 'center',
  },

  google: {
    color: '#000000',
    fontSize: 30,
    fontWeight: 'bold',
  },

  mensagemErro: {
    color: '#B00020',
    fontSize: 12,
    marginTop: -5,
    marginBottom: 10,
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
    marginTop: 35,
  },
});