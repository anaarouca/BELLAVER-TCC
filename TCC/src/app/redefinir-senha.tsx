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
import { router, useLocalSearchParams } from 'expo-router';
import {
  confirmPasswordReset,
  verifyPasswordResetCode,
} from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { Ionicons } from '@expo/vector-icons';

export default function RedefinirSenhaScreen() {
  const { oobCode } = useLocalSearchParams<{ oobCode?: string }>();

  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
  const [carregando, setCarregando] = useState(false);

  async function redefinirSenha() {
    if (!oobCode || Array.isArray(oobCode)) {
      Alert.alert(
        'Link inválido',
        'Abra o link de recuperação enviado para seu e-mail.'
      );
      return;
    }

    if (!senha || !confirmarSenha) {
      Alert.alert('Atenção', 'Preencha os dois campos de senha.');
      return;
    }

    if (senha.length < 6) {
      Alert.alert(
        'Senha inválida',
        'A senha deve ter pelo menos 6 caracteres.'
      );
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert('Atenção', 'As senhas não coincidem.');
      return;
    }

    try {
      setCarregando(true);

      await verifyPasswordResetCode(auth, oobCode);
      await confirmPasswordReset(auth, oobCode, senha);

      Alert.alert(
        'Senha redefinida!',
        'Sua senha foi alterada com sucesso. Entre com a nova senha.',
        [
          {
            text: 'Ir para login',
            onPress: () => router.replace('/login'),
          },
        ]
      );
    } catch (erro: any) {
      if (
        erro.code === 'auth/expired-action-code' ||
        erro.code === 'auth/invalid-action-code'
      ) {
        Alert.alert(
          'Link expirado ou inválido',
          'Solicite um novo link de recuperação de senha.'
        );
      } else {
        Alert.alert(
          'Erro',
          'Não foi possível redefinir sua senha. Tente novamente.'
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

        <View style={styles.formulario}>
          <Text style={styles.label}>NOVA SENHA</Text>

          <View style={styles.campoSenha}>
            <TextInput
              style={styles.input}
              placeholder="Digite a Nova Senha.."
              placeholderTextColor="#888888"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry={!mostrarSenha}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              style={styles.olho}
              onPress={() => setMostrarSenha(!mostrarSenha)}
            >
              <Ionicons
                name={mostrarSenha ? 'eye-off-outline' : 'eye-outline'}
                size={21}
                color="#111111"
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>CONFIRMAR NOVA SENHA</Text>

          <View style={styles.campoSenha}>
            <TextInput
              style={styles.input}
              placeholder="Confirme a Nova Senha.."
              placeholderTextColor="#888888"
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
              secureTextEntry={!mostrarConfirmacao}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              style={styles.olho}
              onPress={() =>
                setMostrarConfirmacao(!mostrarConfirmacao)
              }
            >
              <Ionicons
                name={
                  mostrarConfirmacao
                    ? 'eye-off-outline'
                    : 'eye-outline'
                }
                size={21}
                color="#111111"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.botao, carregando && styles.botaoDesativado]}
            onPress={redefinirSenha}
            disabled={carregando}
          >
            {carregando ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.textoBotao}>REDEFINIR SENHA</Text>
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
    marginTop: 12,
    marginBottom: 42,
  },
  formulario: {
    width: '100%',
  },
  label: {
    color: '#111111',
    fontSize: 12,
    marginBottom: 5,
    marginLeft: 5,
  },
  campoSenha: {
    position: 'relative',
    justifyContent: 'center',
    marginBottom: 22,
  },
  input: {
    height: 51,
    backgroundColor: '#EEEEEE',
    borderWidth: 1,
    borderColor: '#111111',
    borderRadius: 3,
    paddingHorizontal: 15,
    paddingRight: 45,
    color: '#111111',
    fontSize: 12,
  },
  olho: {
    position: 'absolute',
    right: 12,
    height: 51,
    justifyContent: 'center',
  },
  botao: {
    height: 55,
    backgroundColor: '#000000',
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
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
    marginTop: 45,
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