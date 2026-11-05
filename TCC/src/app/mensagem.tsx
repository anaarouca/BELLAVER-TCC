import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function MensagemProdutoScreen() {
  const { id, nome } = useLocalSearchParams<{ id?: string; nome?: string }>();

  function verProduto() {
    if (!id) {
      router.replace('/catalogo');
      return;
    }

    router.replace({ pathname: '/produto2', params: { id } });
  }

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
        <Text style={styles.titulo}>Produto adicionado com sucesso!</Text>
        <Text style={styles.descricao}>
          {nome
            ? `${nome} já está disponível no catálogo.`
            : 'Seu produto já está disponível no catálogo.'}
        </Text>

        <TouchableOpacity
          style={styles.botaoPrincipal}
          onPress={verProduto}
          activeOpacity={0.8}
        >
          <Text style={styles.textoBotao}>Ver produto</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoSecundario}
          onPress={() => router.replace('/catalogo')}
          activeOpacity={0.8}
        >
          <Text style={styles.textoSecundario}>Ir para o catálogo</Text>
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
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    color: '#111111',
    fontSize: 27,
    fontWeight: '300',
    letterSpacing: 6,
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
