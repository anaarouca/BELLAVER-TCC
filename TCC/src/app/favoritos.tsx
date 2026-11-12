
import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  ImageSourcePropType,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useFavoritos } from '../hooks/useFavoritos';
import {
  listarProdutosCadastrados,
  ProdutoCadastrado,
} from '../data/produtosCadastrados';

type ProdutoFavorito = {
  id: string;
  nome: string;
  precoOriginal: string;
  preco: string;
  imagem: ImageSourcePropType;
  cadastrado?: boolean;
};

const produtosDisponiveis: ProdutoFavorito[] = [
  {
    id: '1',
    nome: 'Blusa em organza de seda Branco',
    precoOriginal: 'R$ 890,00',
    preco: 'R$ 760,00',
    imagem: require('../../assets/Img/BlusaEmOrganza.png'),
  },
  {
    id: '2',
    nome: 'Set Denim Grand Icon Azul Gisele Edition',
    precoOriginal: 'R$ 1.480,00',
    preco: 'R$ 1.197,00',
    imagem: require('../../assets/Img/SetDenimGrand.png'),
  },
  {
    id: '3',
    nome: 'Gown Saint Tropez Branco',
    precoOriginal: 'R$ 1.280,00',
    preco: 'R$ 897,00',
    imagem: require('../../assets/Img/GownSaint.png'),
  },
  {
    id: '4',
    nome: 'Trench Coat Alfaiataria Preto',
    precoOriginal: 'R$ 3.500,00',
    preco: 'R$ 320,00',
    imagem: require('../../assets/Img/TrenchCoatAlfaiataria.png'),
  },
  {
    id: '5',
    nome: 'Vestido Longo Azul-Marinho',
    precoOriginal: 'R$ 1.140,00',
    preco: 'R$ 897,00',
    imagem: require('../../assets/Img/VestidoLongoAzul.png'),
  },
  {
    id: '6',
    nome: 'Conjunto Social Preto e Branco',
    precoOriginal: 'R$ 780,00',
    preco: 'R$ 597,00',
    imagem: require('../../assets/Img/ConjuntoSocialPreto.png'),
  },
  {
    id: '7',
    nome: 'Conjunto Alfaiataria Off-White',
    precoOriginal: 'R$ 899,00',
    preco: 'R$ 697,00',
    imagem: require('../../assets/Img/ConjuntoAlfaiatariaOff.png'),
  },
  {
    id: '8',
    nome: 'Colete Alfaiataria Risca de Giz Hudson',
    precoOriginal: 'R$ 389,00',
    preco: 'R$ 297,00',
    imagem: require('../../assets/Img/ColeteAlfaiatariaRisca.png'),
  },
  {
    id: '9',
    nome: 'Tailleur Cinza & Rose Quartz | Ana Paula Renault',
    precoOriginal: 'R$ 780,00',
    preco: 'R$ 597,00',
    imagem: require('../../assets/Img/TailleurCinzaRose.png'),
  },
  {
    id: '10',
    nome: 'Set Denim Grand Icon Azul Gisele Edition',
    precoOriginal: 'R$ 1.480,00',
    preco: 'R$ 1.197,00',
    imagem: require('../../assets/Img/SetDenimGrand.png'),
  },
  {
    id: 'masc1',
    nome: 'Blusa Élégance em Seda Off-White',
    precoOriginal: 'R$ 499,90',
    preco: 'R$ 349,90',
    imagem: require('../../assets/Img/BlusaÉlégance.png'),
  },
  {
    id: 'masc2',
    nome: 'Jaqueta Grand Icon Denim Marrom',
    precoOriginal: 'R$ 1.090,00',
    preco: 'R$ 829,90',
    imagem: require('../../assets/Img/JaquetaGrand.png'),
  },
  {
    id: 'masc3',
    nome: 'Suéter Saint Laurent Azul Marinho',
    precoOriginal: 'R$ 699,00',
    preco: 'R$ 529,90',
    imagem: require('../../assets/Img/SuéterSaint.png'),
  },
  {
    id: 'masc4',
    nome: 'Trench Coat Milano Alfaiataria Preto',
    precoOriginal: 'R$ 1.309,00',
    preco: 'R$ 1.049,90',
    imagem: require('../../assets/Img/TrenchMasculino.png'),
  },
  {
    id: 'masc5',
    nome: 'Casaco Heritage Cinza',
    precoOriginal: 'R$ 849,00',
    preco: 'R$ 679,90',
    imagem: require('../../assets/Img/CasacoHeritage.png'),
  },
  {
    id: 'masc6',
    nome: 'Camisa Social Azul-Claro',
    precoOriginal: 'R$ 429,90',
    preco: 'R$ 319,90',
    imagem: require('../../assets/Img/CamisaSocial.png'),
  },
  {
    id: 'bellahope-bolsa-saint-laurent',
    nome: 'Bolsa Saint Laurent Élégance',
    precoOriginal: 'R$ 4.990,00',
    preco: 'R$ 4.990,00',
    imagem: require('../../assets/Img/bellahopeImg/BolsaSaintLaurent.png'),
  },
  {
    id: 'bellahope-sandalia-gisele-grand',
    nome: 'Sandália Gisele Grand Icon',
    precoOriginal: 'R$ 1.197,00',
    preco: 'R$ 1.197,00',
    imagem: require('../../assets/Img/bellahopeImg/SandáliaGiseleGrand.png'),
  },
  {
    id: 'bellahope-casaco-saint-tropez',
    nome: 'Casaco Saint Tropez Heritage',
    precoOriginal: 'R$ 897,00',
    preco: 'R$ 897,00',
    imagem: require('../../assets/Img/bellahopeImg/CasacoSaintTropez.png'),
  },
  {
    id: 'bellahope-bota-alfaiataria-noir',
    nome: 'Bota Alfaiataria Noir',
    precoOriginal: 'R$ 320,00',
    preco: 'R$ 320,00',
    imagem: require('../../assets/Img/bellahopeImg/BotaAlfaitariaNoir.png'),
  },
  {
    id: 'bellahope-blazer-grand-lapel',
    nome: 'Blazer Alfaiataria Grand Lapel',
    precoOriginal: 'R$ 897,00',
    preco: 'R$ 897,00',
    imagem: require('../../assets/Img/bellahopeImg/BlazerAlfaitariaGrandLapel.png'),
  },
  {
    id: 'bellahope-relogio-fifth-avenue',
    nome: 'Relógio Fifth Avenue Classic',
    precoOriginal: 'R$ 597,00',
    preco: 'R$ 597,00',
    imagem: require('../../assets/Img/bellahopeImg/RelógioFifthAvenue.png'),
  },
];

export default function FavoritosScreen() {
  const { width } = useWindowDimensions();
  const { favoritos, alternarFavorito } = useFavoritos();

  const [itensSacola, setItensSacola] = useState(2);
  const [produtosCadastrados, setProdutosCadastrados] = useState<
    ProdutoCadastrado[]
  >([]);

  const isDesktop = width >= 768;
  const produtos = [
    ...produtosDisponiveis,
    ...produtosCadastrados.map((produto) => ({
      id: produto.id,
      nome: produto.nome,
      precoOriginal: produto.precoOriginal,
      preco: produto.precoDesconto,
      imagem: { uri: produto.imagens[0] },
      cadastrado: true,
    })),
  ].filter((produto) => favoritos.includes(produto.id));

  function adicionarSacola(produto: (typeof produtos)[number]) {
    setItensSacola((quantidade) => quantidade + 1);
    Alert.alert(
      'Produto adicionado',
      `${produto.nome} foi adicionado à sua sacola.`
    );
  }

  useFocusEffect(
    useCallback(() => {
      let ativo = true;

      listarProdutosCadastrados()
        .then((produtosSalvos) => {
          if (ativo) {
            setProdutosCadastrados(produtosSalvos);
          }
        })
        .catch((erro: unknown) => {
          console.error('Erro ao carregar produtos favoritos:', erro);
          Alert.alert(
            'Erro ao carregar favoritos',
            erro instanceof Error
              ? erro.message
              : 'Não foi possível carregar os produtos cadastrados.'
          );
        });

      return () => {
        ativo = false;
      };
    }, [])
  );

  return (
    <SafeAreaView style={styles.tela}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <View
          style={[
            styles.aplicativo,
            {
              maxWidth: isDesktop ? 1250 : 600,
            },
          ]}
        >
          <View
            style={[
              styles.cabecalho,
              { height: isDesktop ? 130 : 113 },
            ]}
          >
            <TouchableOpacity
              style={styles.voltar}
              onPress={() => {
                if (router.canGoBack()) {
                  router.back();
                } else {
                  router.replace('/home');
                }
              }}
              accessibilityRole="button"
              accessibilityLabel="Voltar para a tela anterior"
            >
              <Ionicons
                name="arrow-back-outline"
                size={25}
                color="#111111"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menu}
              onPress={() => router.push('/menu')}
            >
              <Ionicons
                name="menu-outline"
                size={27}
                color="#111111"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.logo}
              onPress={() => router.replace('/home')}
            >
              <Text
                style={[
                  styles.nomeLogo,
                  { fontSize: isDesktop ? 34 : 29 },
                ]}
              >
                BELLAVER
              </Text>

              <Text style={styles.anoLogo}>
                EST. 1972
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divisoria} />

          <View style={styles.abas}>
            <TouchableOpacity
              style={styles.aba}
              onPress={() => router.push('/sacola')}
            >
              <Text style={styles.textoAba}>
                SACOLA ({itensSacola})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.aba, styles.abaAtiva]}
            >
              <Text
                style={[styles.textoAba, styles.textoAbaAtivo]}
              >
                FAVORITOS ({favoritos.length})
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.cabecalhoFavoritos}>
            <View style={styles.titulos}>
              <Text
                style={[
                  styles.titulo,
                  { fontSize: isDesktop ? 23 : 20 },
                ]}
              >
                Meus Favoritos
              </Text>

              <Text style={styles.subtitulo}>
                Você salvou {favoritos.length} itens
              </Text>
            </View>
          </View>

          {produtos.length > 0 ? (
            <View
              style={[
                styles.grade,
                {
                  marginHorizontal: 20,
                  columnGap: 0,
                },
              ]}
            >
              {produtos.map((produto) => (
                <View
                  key={produto.id}
                  style={[
                    styles.cardProduto,
                    { width: '48%' },
                  ]}
                >
                  <TouchableOpacity
                    style={styles.containerImagem}
                    onPress={() =>
                      produto.cadastrado
                        ? router.push({
                            pathname: '/produto2',
                            params: { id: produto.id },
                          })
                        : router.push('/catalogo')
                    }
                    activeOpacity={0.8}
                  >
                    <Image
                      source={produto.imagem}
                      style={[
                        styles.imagemProduto,
                        {
                          filter: 'grayscale(100%)',
                        } as any,
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
                      numberOfLines={2}
                    >
                      {produto.nome}
                    </Text>

                    <TouchableOpacity
                      style={styles.botaoCoracao}
                      onPress={() => alternarFavorito(produto.id)}
                      accessibilityRole="button"
                      accessibilityLabel={`Remover ${produto.nome} dos favoritos`}
                    >
                      <Ionicons
                        name="heart"
                        size={isDesktop ? 19 : 17}
                        color="#000000"
                      />
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.precoOriginal}>
                    {produto.precoOriginal}
                  </Text>
                  <Text style={styles.precoAntigo}>
                    {produto.preco}
                  </Text>

                  <TouchableOpacity
                    style={styles.botaoSacola}
                    onPress={() => adicionarSacola(produto)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.textoBotaoSacola}>
                      Adicionar à Sacola
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.botaoRemover}
                    onPress={() => alternarFavorito(produto.id)}
                    accessibilityRole="button"
                    accessibilityLabel={`Remover ${produto.nome} dos favoritos`}
                  >
                    <Text style={styles.textoRemover}>
                      Remover dos favoritos
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.textoVazio}>
              Você ainda não tem favoritos.
            </Text>
          )}

          <View style={styles.banner}>
            <Ionicons
              name="heart-outline"
              size={30}
              color="#000000"
            />

            <View style={styles.textosBanner}>
              <Text style={styles.tituloBanner}>
                Ainda não encontrou tudo?
              </Text>

              <Text style={styles.subtituloBanner}>
                Tem muita coisa nova te esperando.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.botaoExplorar}
              onPress={() => router.push('/catalogo')}
              activeOpacity={0.8}
            >
              <Text style={styles.textoExplorar}>
                Explorar produtos
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.espacoFinal} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  scroll: {
    flexGrow: 1,
    width: '100%',
  },

  aplicativo: {
    width: '100%',
    alignSelf: 'center',
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  cabecalho: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  logo: {
    alignItems: 'center',
    marginTop: 7,
  },

  nomeLogo: {
    fontWeight: '300',
    letterSpacing: 6,
    color: '#080808',
  },

  anoLogo: {
    fontSize: 11,
    marginTop: 6,
    color: '#111111',
  },

  voltar: {
    position: 'absolute',
    left: 22,
    top: 30,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },

  menu: {
    position: 'absolute',
    right: 22,
    top: 30,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },

  divisoria: {
    height: 1,
    backgroundColor: '#AAAAAA',
    marginHorizontal: 17,
    marginBottom: 30,
  },

  abas: {
    height: 36,
    flexDirection: 'row',
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },

  aba: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },

  abaAtiva: {
    borderBottomColor: '#777777',
  },

  textoAba: {
    fontSize: 10,
    color: '#AAAAAA',
    fontWeight: '500',
  },

  textoAbaAtivo: {
    color: '#111111',
    fontWeight: '700',
  },

  cabecalhoFavoritos: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 0,
    paddingHorizontal: 22,
  },

  titulos: {
    flex: 1,
  },

  titulo: {
    fontWeight: '700',
    color: '#080808',
  },

  subtitulo: {
    fontSize: 11,
    color: '#888888',
    marginTop: 4,
  },

  grade: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 28,
    marginTop: 18,
  },

  cardProduto: {
    marginBottom: 5,
    minWidth: 0,
  },

  containerImagem: {
    width: '100%',
    aspectRatio: 0.97,
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
    marginTop: 5,
    minHeight: 28,
    gap: 5,
  },

  nomeProduto: {
    flex: 1,
    lineHeight: 16,
    color: '#111111',
  },

  precoOriginal: {
    fontSize: 9,
    color: '#AAAAAA',
    textDecorationLine: 'line-through',
    marginTop: 1,
  },

  botaoCoracao: {
    paddingLeft: 3,
    paddingBottom: 3,
  },

  precoAntigo: {
    fontSize: 10,
    color: '#111111',
    marginTop: 0,
  },

  botaoSacola: {
    minHeight: 20,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    paddingHorizontal: 4,
  },

  textoBotaoSacola: {
    fontSize: 10,
    color: '#FFFFFF',
  },

  botaoRemover: {
    alignSelf: 'center',
    paddingTop: 5,
    paddingBottom: 0,
  },

  textoRemover: {
    fontSize: 10,
    color: '#444444',
    textDecorationLine: 'underline',
  },

  textoVazio: {
    alignSelf: 'center',
    color: '#888888',
    fontSize: 13,
    marginTop: 32,
  },

  banner: {
    width: '80%',
    minHeight: 46,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginTop: 28,
  },

  textosBanner: {
    flex: 1,
    marginLeft: 12,
  },

  tituloBanner: {
    fontSize: 12,
    color: '#555555',
  },

  subtituloBanner: {
    fontSize: 10,
    color: '#777777',
    marginTop: 3,
  },

  botaoExplorar: {
    backgroundColor: '#DEDEDE',
    paddingHorizontal: 9,
    paddingVertical: 7,
    marginLeft: 6,
  },

  textoExplorar: {
    fontSize: 10,
    color: '#111111',
    fontWeight: '600',
  },

  espacoFinal: {
    height: 35,
  },
});
