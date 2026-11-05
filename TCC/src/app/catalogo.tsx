import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useFavoritos } from '../hooks/useFavoritos';

const produtos = [
  {
    id: '1',
    nome: 'Blusa em organza de seda Branco',
    original: 'R$ 890,00',
    preco: 'R$ 760,00',
    imagem: require('../../assets/Img/BlusaEmOrganza.png'),
  },
  {
    id: '2',
    nome: 'Set Denim Grand Icon Azul Gisele Edition',
    original: 'R$ 1.480,00',
    preco: 'R$ 1.197,00',
    imagem: require('../../assets/Img/SetDenimGrand.png'),
  },
  {
    id: '3',
    nome: 'Gown Saint Tropez Branco',
    original: 'R$ 1.280,00',
    preco: 'R$ 897,00',
    imagem: require('../../assets/Img/GownSaint.png'),
  },
  {
    id: '4',
    nome: 'Trench Coat Alfaiataria Preto',
    original: 'R$ 3.500,00',
    preco: 'R$ 320,00',
    imagem: require('../../assets/Img/TrenchCoatAlfaiataria.png'),
  },
  {
    id: '5',
    nome: 'Vestido Longo Azul-Marinho',
    original: 'R$ 1.140,00',
    preco: 'R$ 897,00',
    imagem: require('../../assets/Img/VestidoLongoAzul.png'),
  },
  {
    id: '6',
    nome: 'Conjunto Social Preto e Branco',
    original: 'R$ 780,00',
    preco: 'R$ 597,00',
    imagem: require('../../assets/Img/ConjuntoSocialPreto.png'),
  },
  {
    id: '7',
    nome: 'Conjunto Alfaiataria Off-White',
    original: 'R$ 899,00',
    preco: 'R$ 697,00',
    imagem: require('../../assets/Img/ConjuntoAlfaiatariaOff.png'),
  },
  {
    id: '8',
    nome: 'Colete Alfaiataria Risca de Giz Hudson',
    original: 'R$ 389,00',
    preco: 'R$ 297,00',
    imagem: require('../../assets/Img/ColeteAlfaiatariaRisca.png'),
  },
  {
    id: '9',
    nome: 'Tailleur Cinza & Rose Quartz | Ana Paula Renault',
    original: 'R$ 780,00',
    preco: 'R$ 597,00',
    imagem: require('../../assets/Img/TailleurCinzaRose.png'),
  },
  {
    id: '10',
    nome: 'Set Denim Grand Icon Azul Gisele Edition',
    original: 'R$ 1.480,00',
    preco: 'R$ 1.197,00',
    imagem: require('../../assets/Img/SetDenimGrand.png'),
  },
];

export default function CatalogoScreen() {
  const { favoritos, alternarFavorito } = useFavoritos();

  function abrirProduto(id: string) {
    router.push({
      pathname: '/Produtos',
      params: { id },
    } as any);
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
          style={styles.botaoMenu}
          onPress={() => router.push('/menu')}
        >
          <Ionicons name="menu-outline" size={28} color="#111111" />
        </TouchableOpacity>
      </View>

      <View style={styles.divisorTopo} />

      <View style={styles.barraTitulo}>
        <Text style={styles.titulo}>NOVIDADES</Text>

        <TouchableOpacity onPress={() => router.push('/pesquisar' as any)}>
          <Ionicons name="search-outline" size={19} color="#111111" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.conteudo}
      >
        <View style={styles.grade}>
          {produtos.map((produto) => (
            <View style={styles.cardProduto} key={produto.id}>
              <TouchableOpacity
                style={styles.areaImagem}
                activeOpacity={0.8}
                onPress={() => abrirProduto(produto.id)}
              >
                <Image
                  source={produto.imagem}
                  style={[
                    styles.imagemProduto,
                    { filter: 'grayscale(100%)' } as any,
                  ]}
                  resizeMode="cover"
                />
              </TouchableOpacity>

              <View style={styles.linhaNome}>
                <TouchableOpacity
                  style={styles.nomeClicavel}
                  onPress={() => abrirProduto(produto.id)}
                >
                  <Text style={styles.nomeProduto}>
                    {produto.nome}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.botaoFavorito}
                  onPress={() => alternarFavorito(produto.id)}
                >
                  <Ionicons
                    name={
                      favoritos.includes(produto.id)
                        ? 'heart'
                        : 'heart-outline'
                    }
                    size={17}
                    color="#111111"
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={() => abrirProduto(produto.id)}>
                <Text style={styles.precoOriginal}>
                  {produto.original}
                </Text>

                <Text style={styles.precoAtual}>
                  {produto.preco}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
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
    height: 114,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  espaco: {
    width: 28,
  },
  marca: {
    flex: 1,
    alignItems: 'center',
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
    marginTop: 6,
  },
  botaoMenu: {
    width: 28,
    alignItems: 'center',
  },
  divisorTopo: {
    height: 1,
    backgroundColor: '#BBBBBB',
    marginHorizontal: 16,
  },
  barraTitulo: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
  },
  titulo: {
    flex: 1,
    textAlign: 'center',
    color: '#888888',
    fontSize: 10,
    fontWeight: '300',
  },
  conteudo: {
    paddingHorizontal: 24,
    paddingTop: 0,
    paddingBottom: 30,
  },
  grade: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 18,
  },
  cardProduto: {
    width: '46.5%',
  },
  areaImagem: {
    width: '100%',
    aspectRatio: 0.83,
    backgroundColor: '#EEEEEE',
    overflow: 'hidden',
  },
  imagemProduto: {
    width: '100%',
    height: '100%',
  },
  linhaNome: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 6,
  },
  nomeClicavel: {
    flex: 1,
  },
  nomeProduto: {
    flex: 1,
    color: '#111111',
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '400',
    paddingRight: 3,
  },
  botaoFavorito: {
    width: 22,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 2,
    flexShrink: 0,
  },
  precoOriginal: {
    color: '#999999',
    fontSize: 8,
    textDecorationLine: 'line-through',
    marginTop: 2,
  },
  precoAtual: {
    color: '#111111',
    fontSize: 10,
    marginTop: 1,
  },
});