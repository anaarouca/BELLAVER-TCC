
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFavoritos } from '../hooks/useFavoritos';

const novidades = [
  {
    id: '3',
    nome: 'Gown Saint Tropez Branco',
    original: 'R$ 1.280,00',
    preco: 'R$ 897,00',
    imagem: require('../../assets/Img/GownSaint.png'),
  },
  {
    id: '1',
    nome: 'Blusa em organza Branco',
    original: 'R$ 760,00',
    preco: 'R$ 760,00',
    imagem: require('../../assets/Img/BlusaEmOrganza.png'),
  },
  {
    id: '2',
    nome: 'Set Denim Grand Icon Azul',
    original: 'R$ 1.197,00',
    preco: 'R$ 1.197,00',
    imagem: require('../../assets/Img/SetDenimGrand.png'),
  },
];

const maisVendidos = [
  {
    id: '5',
    nome: 'Vestido Longo Azul-Marinho',
    original: 'R$ 1.490,00',
    preco: 'R$ 897,00',
    imagem: require('../../assets/Img/VestidoLongoAzul.png'),
  },
  {
    id: '6',
    nome: 'Conjunto Social Preto & Branco',
    original: 'R$ 890,00',
    preco: 'R$ 597,00',
    imagem: require('../../assets/Img/ConjuntoSocialPreto.png'),
  },
  {
    id: '4',
    nome: 'Trench Coat Alfaiataria Preto',
    original: 'R$ 4.290,00',
    preco: 'R$ 3.200,00',
    imagem: require('../../assets/Img/TrenchCoatAlfaiataria.png'),
  },
];

const categorias = [
  {
    nome: 'Feminino',
    imagem: require('../../assets/Img/Feminino.png'),
  },
  {
    nome: 'Masculino',
    imagem: require('../../assets/Img/Masculino.png'),
  },
  {
    nome: 'Calçados',
    imagem: require('../../assets/Img/Calçados.png'),
  },
  {
    nome: 'Acessórios',
    imagem: require('../../assets/Img/Acessórios.png'),
  },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { favoritos, alternarFavorito } = useFavoritos();

  const isDesktop = width >= 768;
  const margem = isDesktop ? 38 : 18;
  const alturaBanner = isDesktop ? 280 : 180;

  function abrirCatalogo() {
    router.push('/catalogo');
  }

  function renderProdutos(
    titulo: string,
    produtos: typeof novidades
  ) {
    return (
      <View
        style={[
          styles.secao,
          {
            marginHorizontal: margem,
            marginBottom: isDesktop ? 38 : 30,
          },
        ]}
      >
        <View style={styles.tituloSecao}>
          <Text
            style={[
              styles.titulo,
              { fontSize: isDesktop ? 17 : 14 },
            ]}
          >
            {titulo}
          </Text>

          <TouchableOpacity onPress={abrirCatalogo}>
            <Text
              style={[
                styles.verTudo,
                { fontSize: isDesktop ? 10 : 9 },
              ]}
            >
              VER TUDO
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.listaProdutos}>
          {produtos.map((produto) => (
            <View
              style={[
                styles.produto,
                {
                  width: isDesktop ? '31.8%' : '48%',
                },
              ]}
              key={produto.id}
            >
              <TouchableOpacity
                onPress={abrirCatalogo}
                style={styles.areaImagem}
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
                <Text
                  style={[
                    styles.nomeProduto,
                    { fontSize: isDesktop ? 13 : 11 },
                  ]}
                >
                  {produto.nome}
                </Text>

                <TouchableOpacity
                  onPress={() => alternarFavorito(produto.id)}
                  style={styles.botaoFavorito}
                >
                  <Ionicons
                    name={
                      favoritos.includes(produto.id)
                        ? 'heart'
                        : 'heart-outline'
                    }
                    size={isDesktop ? 19 : 17}
                    color="#111111"
                  />
                </TouchableOpacity>
              </View>

              <Text
                style={[
                  styles.precoOriginal,
                  { fontSize: isDesktop ? 10 : 9 },
                ]}
              >
                {produto.original}
              </Text>

              <Text
                style={[
                  styles.preco,
                  { fontSize: isDesktop ? 12 : 11 },
                ]}
              >
                {produto.preco}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.conteudo}>
          <View
            style={[
              styles.cabecalho,
              { height: isDesktop ? 120 : 100 },
            ]}
          >
            <View style={styles.espacoLateral} />

            <View style={styles.marca}>
              <Text
                style={[
                  styles.logo,
                  { fontSize: isDesktop ? 32 : 25 },
                ]}
              >
                BELLAVER
              </Text>

              <Text style={styles.estabelecimento}>
                EST. 1972
              </Text>
            </View>

            <TouchableOpacity
              style={styles.menu}
              onPress={() => router.push('/menu')}
            >
              <Ionicons
                name="menu-outline"
                size={29}
                color="#111111"
              />
            </TouchableOpacity>
          </View>

          <View
            style={[
              styles.linhaCabecalho,
              { marginHorizontal: margem },
            ]}
          />

          <View
            style={[
              styles.banner,
              {
                marginHorizontal: margem,
                height: alturaBanner,
              },
            ]}
          >
            <View style={styles.textoBanner}>
              <Text
                style={[
                  styles.newIn,
                  { fontSize: isDesktop ? 25 : 19 },
                ]}
              >
                NEW IN
              </Text>

              <Text
                style={[
                  styles.desconto,
                  { fontSize: isDesktop ? 29 : 21 },
                ]}
              >
                20% OFF
              </Text>

              <Text
                style={[
                  styles.subtituloBanner,
                  { fontSize: isDesktop ? 13 : 10 },
                ]}
              >
                EM PEÇAS INÉDITAS
              </Text>

              <TouchableOpacity
                style={styles.botaoComprar}
                onPress={abrirCatalogo}
              >
                <Text style={styles.textoBotao}>
                  COMPRE AGORA
                </Text>
              </TouchableOpacity>
            </View>

            <Image
              source={require('../../assets/Img/ColeteAlfaiatariaRisca.png')}
              style={[
                styles.imagemBanner,
                { filter: 'grayscale(100%)' } as any,
              ]}
              resizeMode="cover"
            />
          </View>

          <View
            style={[
              styles.linhaBanner,
              { marginHorizontal: margem },
            ]}
          />

          {renderProdutos('Novidades', novidades)}
          {renderProdutos('Mais vendidos', maisVendidos)}

          <View
            style={[
              styles.secaoCategorias,
              { marginHorizontal: margem },
            ]}
          >
            <View style={styles.tituloSecao}>
              <Text
                style={[
                  styles.titulo,
                  { fontSize: isDesktop ? 17 : 14 },
                ]}
              >
                Categorias em destaque
              </Text>

              <TouchableOpacity
                onPress={() => router.push('/categoria')}
              >
                <Text
                  style={[
                    styles.verTudo,
                    { fontSize: isDesktop ? 10 : 9 },
                  ]}
                >
                  VER TUDO
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.listaCategorias}>
              {categorias.map((categoria) => (
                <TouchableOpacity
                  key={categoria.nome}
                  style={styles.categoria}
                  onPress={abrirCatalogo}
                >
                  <Image
                    source={categoria.imagem}
                    style={[
                      styles.imagemCategoria,
                      {
                        width: isDesktop ? 105 : 75,
                        height: isDesktop ? 105 : 75,
                        filter: 'grayscale(100%)',
                      } as any,
                    ]}
                    resizeMode="cover"
                  />

                  <Text
                    style={[
                      styles.nomeCategoria,
                      { fontSize: isDesktop ? 12 : 10 },
                    ]}
                  >
                    {categoria.nome}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.rodape}>
            <Text style={styles.textoRodape}>
              BELLAVER ® TODOS OS DIREITOS RESERVADOS
            </Text>
          </View>
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
  conteudo: {
    width: '100%',
    maxWidth: 1250,
    alignSelf: 'center',
  },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  espacoLateral: {
    width: 28,
  },
  marca: {
    alignItems: 'center',
    flex: 1,
  },
  logo: {
    color: '#111111',
    fontWeight: '300',
    letterSpacing: 6,
  },
  estabelecimento: {
    color: '#111111',
    fontSize: 11,
    marginTop: 6,
  },
  menu: {
    width: 28,
    alignItems: 'center',
  },
  linhaCabecalho: {
    height: 1,
    backgroundColor: '#AAAAAA',
    marginBottom: 35,
  },
  banner: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#AAAAAA',
  },
  textoBanner: {
    width: '46%',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 9,
    paddingRight: 12,
  },
  newIn: {
    fontWeight: '600',
    color: '#111111',
  },
  desconto: {
    fontWeight: 'bold',
    color: '#111111',
    marginTop: 6,
  },
  subtituloBanner: {
    color: '#111111',
    marginTop: 7,
  },
  botaoComprar: {
    backgroundColor: '#000000',
    paddingVertical: 12,
    paddingHorizontal: 9,
    marginTop: 16,
    width: '100%',
    alignItems: 'center',
  },
  textoBotao: {
    color: '#FFFFFF',
    fontSize: 10,
  },
  imagemBanner: {
    width: '54%',
    height: '100%',
  },
  linhaBanner: {
    height: 1,
    backgroundColor: '#AAAAAA',
    marginBottom: 30,
  },
  secao: {},
  tituloSecao: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  titulo: {
    color: '#111111',
    fontWeight: '600',
  },
  verTudo: {
    color: '#111111',
  },
  listaProdutos: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 24,
  },
  produto: {
    minWidth: 0,
    marginBottom: 2,
  },
  areaImagem: {
    width: '100%',
    aspectRatio: 0.94,
    overflow: 'hidden',
    backgroundColor: '#F2F2F2',
  },
  imagemProduto: {
    width: '100%',
    height: '100%',
  },
  linhaNome: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginTop: 7,
    gap: 4,
  },
  nomeProduto: {
    flex: 1,
    color: '#111111',
    lineHeight: 16,
  },
  botaoFavorito: {
    paddingLeft: 3,
    paddingBottom: 3,
  },
  precoOriginal: {
    color: '#999999',
    textDecorationLine: 'line-through',
    marginTop: 4,
  },
  preco: {
    color: '#111111',
    marginTop: 3,
  },
  secaoCategorias: {
    marginBottom: 35,
  },
  listaCategorias: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
    gap: 10,
  },
  categoria: {
    flex: 1,
    alignItems: 'center',
  },
  imagemCategoria: {
    borderRadius: 100,
    backgroundColor: '#EEEEEE',
  },
  nomeCategoria: {
    color: '#111111',
    marginTop: 9,
    textAlign: 'center',
  },
  rodape: {
    minHeight: 45,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  textoRodape: {
    color: '#FFFFFF',
    fontSize: 9,
    textAlign: 'center',
  },
});
