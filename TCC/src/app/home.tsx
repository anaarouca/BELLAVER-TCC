import { useState } from 'react';
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const novidades = [
  {
    nome: 'Gown Saint Tropez Branco',
    original: 'R$ 1.280,00',
    preco: 'R$ 897,00',
    imagem: require('../../assets/Img/GownSaint.png'),
  },
  {
    nome: 'Blusa em organza Branco',
    original: 'R$ 760,00',
    preco: 'R$ 760,00',
    imagem: require('../../assets/Img/BlusaEmOrganza.png'),
  },
  {
    nome: 'Set Denim Grand Icon Azul',
    original: 'R$ 1.197,00',
    preco: 'R$ 1.197,00',
    imagem: require('../../assets/Img/SetDenimGrand.png'),
  },
];

const maisVendidos = [
  {
    nome: 'Vestido Longo Azul-Marinho',
    original: 'R$ 1.490,00',
    preco: 'R$ 897,00',
    imagem: require('../../assets/Img/VestidoLongoAzul.png'),
  },
  {
    nome: 'Conjunto Social Preto & Branco',
    original: 'R$ 890,00',
    preco: 'R$ 597,00',
    imagem: require('../../assets/Img/ConjuntoSocialPreto.png'),
  },
  {
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
  const [favoritos, setFavoritos] = useState<string[]>([]);
  const insets = useSafeAreaInsets();

  function alternarFavorito(nome: string) {
    setFavoritos((atuais) =>
      atuais.includes(nome)
        ? atuais.filter((item) => item !== nome)
        : [...atuais, nome]
    );
  }

  function abrirCatalogo() {
    router.push('/catalogo');
  }

  function renderProdutos(
    titulo: string,
    produtos: typeof novidades
  ) {
    return (
      <View style={styles.secao}>
        <View style={styles.tituloSecao}>
          <Text style={styles.titulo}>{titulo}</Text>

          <TouchableOpacity onPress={abrirCatalogo}>
            <Text style={styles.verTudo}>VER TUDO</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.listaProdutos}>
          {produtos.map((produto) => (
            <View style={styles.produto} key={produto.nome}>
              <TouchableOpacity onPress={abrirCatalogo}>
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
                <Text style={styles.nomeProduto}>
                  {produto.nome}
                </Text>

                <TouchableOpacity
                  onPress={() => alternarFavorito(produto.nome)}
                >
                  <Ionicons
                    name={
                      favoritos.includes(produto.nome)
                        ? 'heart'
                        : 'heart-outline'
                    }
                    size={15}
                    color="#111111"
                  />
                </TouchableOpacity>
              </View>

              <Text style={styles.precoOriginal}>
                {produto.original}
              </Text>

              <Text style={styles.preco}>
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
        {/* CABEÇALHO */}
        <View style={styles.cabecalho}>
          <View style={styles.espacoLateral} />

          <View style={styles.marca}>
            <Text style={styles.logo}>BELLAVER</Text>
            <Text style={styles.estabelecimento}>EST. 1972</Text>
          </View>


          <TouchableOpacity
            style={styles.menu}
            onPress={() => router.push('/menu')}
          >
            <Ionicons name="menu-outline" size={29} color="#111111" />
          </TouchableOpacity>

        </View>

        <View style={styles.linhaCabecalho} />

        {/* DESTAQUE */}
        <View style={styles.banner}>
          <View style={styles.textoBanner}>
            <Text style={styles.newIn}>NEW IN</Text>
            <Text style={styles.desconto}>20% OFF</Text>
            <Text style={styles.subtituloBanner}>
              EM PEÇAS INÉDITAS
            </Text>

            <TouchableOpacity
              style={styles.botaoComprar}
              onPress={abrirCatalogo}
            >
              <Text style={styles.textoBotao}>COMPRE AGORA</Text>
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

        <View style={styles.linhaBanner} />

        {/* PRODUTOS */}
        {renderProdutos('Novidades', novidades)}
        {renderProdutos('Mais vendidos', maisVendidos)}

        {/* CATEGORIAS */}
        <View style={styles.secaoCategorias}>
          <View style={styles.tituloSecao}>
            <Text style={styles.titulo}>
              Categorias em destaque
            </Text>

            <TouchableOpacity onPress={() => router.push('/categoria')}>
              <Text style={styles.verTudo}>VER TUDO</Text>
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
                    { filter: 'grayscale(100%)' } as any,
                  ]}
                  resizeMode="cover"
                />

                <Text style={styles.nomeCategoria}>
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
    height: 110,
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
    fontSize: 28,
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
    marginHorizontal: 38,
    marginBottom: 40,
  },

  banner: {
    flexDirection: 'row',
    marginHorizontal: 38,
    minHeight: 188,
    borderTopWidth: 1,
    borderColor: '#AAAAAA',
  },

  textoBanner: {
    width: '46%',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 9,
    paddingRight: 5,
  },

  newIn: {
    fontSize: 19,
    fontWeight: '600',
    color: '#111111',
  },

  desconto: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#111111',
    marginTop: 6,
  },

  subtituloBanner: {
    fontSize: 10,
    color: '#111111',
    marginTop: 7,
  },

  botaoComprar: {
    backgroundColor: '#000000',
    paddingVertical: 10,
    paddingHorizontal: 9,
    marginTop: 14,
    width: '100%',
    alignItems: 'center',
  },

  textoBotao: {
    color: '#FFFFFF',
    fontSize: 10,
  },

  imagemBanner: {
    width: '54%',
    height: 188,
  },

  linhaBanner: {
    height: 1,
    backgroundColor: '#AAAAAA',
    marginHorizontal: 38,
    marginBottom: 30,
  },

  secao: {
    marginHorizontal: 38,
    marginBottom: 28,
  },

  tituloSecao: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  titulo: {
    color: '#111111',
    fontSize: 13,
    fontWeight: '600',
  },

  verTudo: {
    color: '#111111',
    fontSize: 8,
  },

  listaProdutos: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },

  produto: {
    flex: 1,
    minWidth: 0,
  },

  imagemProduto: {
    width: '100%',
    height: 100,
    backgroundColor: '#EEEEEE',
  },

  linhaNome: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginTop: 7,
    gap: 3,
  },

  nomeProduto: {
    flex: 1,
    color: '#111111',
    fontSize: 9,
    lineHeight: 12,
  },

  precoOriginal: {
    color: '#999999',
    fontSize: 7,
    textDecorationLine: 'line-through',
    marginTop: 3,
  },

  preco: {
    color: '#111111',
    fontSize: 9,
    marginTop: 2,
  },

  secaoCategorias: {
    marginHorizontal: 38,
    marginBottom: 30,
  },

  listaCategorias: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    gap: 10,
  },

  categoria: {
    flex: 1,
    alignItems: 'center',
  },

  imagemCategoria: {
    width: 75,
    height: 75,
    borderRadius: 100,
    backgroundColor: '#EEEEEE',
  },

  nomeCategoria: {
    color: '#111111',
    fontSize: 9,
    marginTop: 8,
    textAlign: 'center',
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
    fontSize: 9,
    textAlign: 'center',
  },
});