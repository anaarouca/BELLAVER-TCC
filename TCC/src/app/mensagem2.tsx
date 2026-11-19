import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Mensagem2Screen() {
  return (
    <View style={styles.container}>
      <View style={styles.marca}>
        <Text style={styles.logo}>BELLAVER</Text>
        <Text style={styles.estabelecimento}>EST. 1972</Text>
      </View>

      <View style={styles.conteudo}>
        <View style={styles.iconeSucesso}>
          <Ionicons name="checkmark" size={40} color="#FFFFFF" />
        </View>
        <Text style={styles.titulo}>Compra finalizada!</Text>
        <Text style={styles.descricao}>
          Sua compra foi confirmada e o produto foi enviado para a sacola.
        </Text>

        <TouchableOpacity
          style={styles.botaoPrincipal}
          onPress={() => router.replace('/home')}
          activeOpacity={0.8}
        >
          <Text style={styles.textoBotao}>IR PARA HOME</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoSecundario}
          onPress={() => router.replace('/sacola')}
          activeOpacity={0.8}
        >
          <Text style={styles.textoSecundario}>VER SACOLA</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 25,
  },
  marca: {
    height: 130,
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 18,
    borderBottomWidth: 2,
    borderBottomColor: '#888888',
  },
  logo: {
    color: '#111111',
    fontSize: 27,
    fontWeight: '300',
    letterSpacing: 6,
    marginTop: 9,
  },
  estabelecimento: {
    color: '#111111',
    fontSize: 11,
    marginTop: 6,
  },
  conteudo: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 80,
  },
  iconeSucesso: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#161616',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  titulo: {
    color: '#111111',
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
  },
  descricao: {
    color: '#666666',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 30,
  },
  botaoPrincipal: {
    width: '100%',
    minHeight: 48,
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  textoBotao: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  botaoSecundario: {
    paddingVertical: 16,
  },
  textoSecundario: {
    color: '#111111',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
