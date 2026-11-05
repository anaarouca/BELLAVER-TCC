
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const opcoes = [
  { nome: 'Configurações', icone: 'settings-outline' as const, rota: '/configuracoes' },
  { nome: 'Favoritos / sacola', icone: 'heart-outline' as const, rota: '/favoritos' },
  { nome: 'Bella Hope', icone: 'ellipse-outline' as const, rota: '/home' },
  { nome: 'Categorias', icone: 'grid-outline' as const, rota: '/catalogo' },
  { nome: 'Notificações', icone: 'notifications-outline' as const, rota: '/notificacoes' },
  { nome: 'Rastreamento do pedido', icone: 'location-outline' as const, rota: '/rastreamento' },
  { nome: 'Meus pedidos', icone: 'mail-outline' as const, rota: '/pedidos' },
  { nome: 'Filtros', icone: 'options-outline' as const, rota: '/filtros' },
  { nome: 'Catálogo', icone: 'document-text-outline' as const, rota: '/catalogo' },
  { nome: 'Pesquisar', icone: 'search-outline' as const, rota: '/catalogo' },
  { nome: 'Tela principal', icone: 'home-outline' as const, rota: '/home' },
];

export default function MenuScreen() {
  function abrirRota(rota: string) {
    router.push(rota as any);
  }

  function sairDaConta() {
    router.replace('/login');
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.cabecalho}>
        <View style={styles.espaco} />

        <View style={styles.marca}>
          <Text style={styles.logo}>BELLAVER</Text>
          <Text style={styles.estabelecimento}>EST. 1972</Text>
        </View>

        <TouchableOpacity
          style={styles.fechar}
          onPress={() => router.replace('/home')}
        >
          <Ionicons name="close" size={27} color="#111111" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.lista}
        showsVerticalScrollIndicator={false}
      >
        {opcoes.map((opcao, index) => (
          <TouchableOpacity
            key={opcao.nome}
            style={[
              styles.item,
              index === 0 && styles.primeiroItem,
            ]}
            onPress={() => abrirRota(opcao.rota)}
          >
            <View style={styles.icone}>
              {opcao.nome === 'Bella Hope' ? (
                <View style={styles.iconeBella}>
                  <Text style={styles.letraBella}>B</Text>
                </View>
              ) : (
                <Ionicons
                  name={opcao.icone}
                  size={32}
                  color="#111111"
                />
              )}
            </View>

            <Text style={styles.nomeOpcao}>{opcao.nome}</Text>

            {opcao.nome !== 'Pesquisar' && (
              <Ionicons
                name="chevron-forward"
                size={21}
                color="#111111"
              />
            )}

            {opcao.nome === 'Pesquisar' && (
              <Ionicons
                name="chevron-forward"
                size={21}
                color="#111111"
              />
            )}
          </TouchableOpacity>
        ))}

        <View style={styles.areaSair}>
          <TouchableOpacity
            style={styles.botaoSair}
            onPress={sairDaConta}
          >
            <Text style={styles.textoSair}>SAIR DA CONTA</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  cabecalho: {
    height: 92,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    paddingHorizontal: 20,
  },

  espaco: {
    width: 28,
  },

  marca: {
    alignItems: 'center',
    flex: 1,
  },

  logo: {
    color: '#111111',
    fontSize: 29,
    fontWeight: '300',
    letterSpacing: 6,
  },

  estabelecimento: {
    color: '#111111',
    fontSize: 11,
    marginTop: 5,
  },

  fechar: {
    width: 28,
    alignItems: 'center',
  },

  lista: {
    flex: 1,
  },

  primeiroItem: {
    marginTop: 0,
  },

  item: {
    minHeight: 78,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 21,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    marginBottom: 13,
  },

  icone: {
    width: 54,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },

  iconeBella: {
    width: 38,
    height: 38,
    borderWidth: 1.5,
    borderColor: '#111111',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },

  letraBella: {
    color: '#111111',
    fontSize: 19,
    fontWeight: '300',
  },

  nomeOpcao: {
    flex: 1,
    color: '#222222',
    fontSize: 16,
    fontWeight: '300',
  },

  areaSair: {
    paddingHorizontal: 25,
    paddingTop: 24,
    paddingBottom: 25,
  },

  botaoSair: {
    height: 59,
    backgroundColor: '#171717',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
  },

  textoSair: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '400',
  },
});
