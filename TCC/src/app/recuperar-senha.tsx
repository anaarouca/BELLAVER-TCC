import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';

import { sendPasswordResetEmail } from 'firebase/auth';

import { auth } from '../firebaseConfig';
import { Ionicons } from '@expo/vector-icons';

export default function RecuperarSenhaScreen() {
  const [email, setEmail] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function enviarLink() {
    if (!email.trim()) {
      Alert.alert('Atenção', 'Digite seu e-mail cadastrado.');
      return;
    }

    try {
      setCarregando(true);



      await sendPasswordResetEmail(auth, email.trim());


      Alert.alert(
        'Confira seu e-mail',
        'Se o endereço estiver cadastrado, você receberá um link para criar uma nova senha.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/login'),
          },
        ]
      );
    } catch (erro: any) {
      if (erro.code === 'auth/invalid-email') {
        Alert.alert('E-mail inválido', 'Digite um endereço de e-mail válido.');
      } else {
        Alert.alert(
          'Não foi possível enviar',
          'Confira o e-mail e tente novamente.'
        );
      }
    } finally {
      setCarregando(false);
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <TouchableOpacity
        style={styles.voltar}
        onPress={() => router.replace('/login')}
      >
        <Ionicons name="chevron-back" size={24} color="#111111" />
      </TouchableOpacity>

      <View style={styles.cabecalho}>
        <Text style={styles.logo}>BELLAVER</Text>
        <Text style={styles.estabelecimento}>EST. 1972</Text>
      </View>

      <View style={styles.divisorTopo} />

      <View style={styles.conteudo}>
        <Text style={styles.titulo}>RECUPERAR</Text>
        <Text style={styles.titulo}>SENHA</Text>
        <View style={styles.tracinho} />

        <Text style={styles.instrucao}>
          INFORME O E-MAIL CADASTRADO
          {'\n'}E ENVIAREMOS UM LINK PARA VOCÊ
          {'\n'}CRIAR UMA NOVA SENHA.
        </Text>

        <View style={styles.formulario}>
          <Text style={styles.label}>E-MAIL</Text>

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

          <TouchableOpacity
            style={[styles.botao, carregando && styles.botaoDesativado]}
            onPress={enviarLink}
            disabled={carregando}
          >
            {carregando ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.textoBotao}>ENVIAR LINK</Text>
            )}
          </TouchableOpacity>

          <View style={styles.separador}>
            <View style={styles.linha} />
            <Text style={styles.ou}>OU</Text>
            <View style={styles.linha} />
          </View>

          <TouchableOpacity
            style={styles.botaoVoltar}
            onPress={() => router.replace('/login')}
          >
            <Text style={styles.textoVoltar}>VOLTAR PARA LOGIN</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.rodape}>
        <Text style={styles.textoRodape}>
          BELLAVER ® TODOS OS DIREITOS RESERVADOS
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  voltar: {
    position: 'absolute',
    top: 12,
    left: 12,
    zIndex: 1,
    padding: 4,
  },
  cabecalho: {
    alignItems: 'center',
    paddingTop: 37,
    paddingBottom: 18,
  },
  logo: {
    color: '#111111',
    fontSize: 29,
    fontWeight: '300',
    letterSpacing: 7,
  },
  estabelecimento: {
    color: '#111111',
    fontSize: 12,
    marginTop: 7,
  },
  divisorTopo: {
    height: 1,
    backgroundColor: '#BBBBBB',
    marginHorizontal: 19,
  },
  conteudo: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 50,
  },
  titulo: {
    color: '#111111',
    fontSize: 20,
    textAlign: 'center',
    lineHeight: 25,
  },
  tracinho: {
    width: 48,
    height: 1,
    backgroundColor: '#111111',
    marginTop: 10,
    marginBottom: 32,
  },
  instrucao: {
    color: '#111111',
    fontSize: 12,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 40,
  },
  formulario: {
    width: '100%',
  },
  label: {
    color: '#111111',
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 5,
  },
  input: {
    height: 51,
    backgroundColor: '#EEEEEE',
    borderWidth: 1,
    borderColor: '#111111',
    borderRadius: 3,
    paddingHorizontal: 15,
    color: '#111111',
    fontSize: 12,
  },
  botao: {
    height: 55,
    backgroundColor: '#000000',
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 37,
  },
  botaoDesativado: {
    opacity: 0.7,
  },
  textoBotao: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  separador: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 37,
    gap: 25,
  },
  linha: {
    flex: 1,
    height: 1,
    backgroundColor: '#888888',
  },
  ou: {
    color: '#111111',
    fontSize: 14,
  },
  botaoVoltar: {
    alignSelf: 'center',
    marginTop: 88,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#111111',
  },
  textoVoltar: {
    color: '#111111',
    fontSize: 13,
  },
  rodape: {
    height: 45,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  textoRodape: {
    color: '#FFFFFF',
    fontSize: 10,
    textAlign: 'center',
  },
});