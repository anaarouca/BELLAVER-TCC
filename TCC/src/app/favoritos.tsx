
import React, { useState } from 'react';
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
import { router } from 'expo-router';
import { useFavoritos } from '../hooks/useFavoritos';

type Produto = {
  id: string;
  nome: string;
  marca: string;
  preco: string;
  precoAntigo: string;
  imagem: ImageSourcePropType;
};

const produtosDisponiveis: Produto[] = [
  {
    id: '1',
    nome: 'Blusa em organza Branco',
    marca: 'Bellaver',
    preco: 'R$ 760,00',
    precoAntigo: 'R$ 760,00',
    imagem: require('../../assets/Img/BlusaEmOrganza.png'),
  },
  {
    id: '2',
    nome: 'Set Denim Grand Icon Azul',
    marca: 'Bellaver',
    preco: 'R$ 1.197,00',
    precoAntigo: 'R$ 1.197,00',
    imagem: require('../../assets/Img/SetDenimGrand.png'),
  },
  {
    id: '3',
    nome: 'Gown Saint Tropez Branco',
    marca: 'Bellaver',
    preco: 'R$ 897,00',
    precoAntigo: 'R$ 1.280,00',
    imagem: require('../../assets/Img/GownSaint.png'),
  },
  {
    id: '4',
    nome: 'Trench Coat Alfaiataria Preto',
    marca: 'Bellaver',
    preco: 'R$ 3.200,00',
    precoAntigo: 'R$ 4.290,00',
    imagem: require('../../assets/Img/TrenchCoatAlfaiataria.png'),
  },
  {
    id: '5',
    nome: 'Vestido Longo Azul-Marinho',
    marca: 'Bellaver',
    preco: 'R$ 897,00',
    precoAntigo: 'R$ 1.490,00',
    imagem: require('../../assets/Img/VestidoLongoAzul.png'),
  },
  {
    id: '6',
    nome: 'Conjunto Social Preto & Branco',
    marca: 'Bellaver',
    preco: 'R$ 597,00',
    precoAntigo: 'R$ 890,00',
    imagem: require('../../assets/Img/ConjuntoSocialPreto.png'),
  },
];

export default function FavoritosScreen() {
  const { width } = useWindowDimensions();
  const { favoritos, alternarFavorito } = useFavoritos();

  const [itensSacola, setItensSacola] = useState(2);
  const [editando, setEditando] = useState(false);

  const isDesktop = width >= 768;

  const produtos = produtosDisponiveis.filter((produto) =>
    favoritos.includes(produto.id)
  );

  function removerFavorito(id: string) {
    alternarFavorito(id);
  }

  function adicionarSacola(produto: Produto) {
    setItensSacola((quantidade) => quantidade + 1);

    Alert.alert(
      'Produto adicionado',
      `${produto.nome} foi adicionado à sua sacola.`
    );
  }

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
                FAVORITOS ({produtos.length})
              </Text>
            </TouchableOpacity>
          </View>

          {produtos.length === 0 ? (
            <View style={styles.vazio}>
              <Ionicons
                name="heart-outline"
                size={44}
                color="#888888"
              />

              <Text style={styles.textoVazio}>
                Você ainda não tem favoritos.
              </Text>

              <TouchableOpacity
                style={styles.botaoExplorarVazio}
                onPress={() => router.push('/catalogo')}
              >
                <Text style={styles.textoBotaoExplorar}>
                  EXPLORAR PRODUTOS
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
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
                    Você salvou {produtos.length} itens
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.botaoEditar}
                  onPress={() => setEditando(!editando)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.textoEditar}>
                    {editando ? 'Concluir' : 'Editar'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View
                style={[
                  styles.grade,
                  {
                    paddingHorizontal: isDesktop ? 10 : 4,
                    columnGap: isDesktop ? 18 : 0,
                  },
                ]}
              >
                {produtos.map((produto) => (
                  <View
                    key={produto.id}
                    style={[
                      styles.cardProduto,
                      {
                        width: isDesktop ? '23.5%' : '48%',
                      },
                    ]}
                  >
                    <TouchableOpacity
                      onPress={() => router.push('/catalogo')}
                      style={styles.containerImagem}
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
                        numberOfLines={2}
                      >
                        {produto.nome}
                      </Text>

                      <TouchableOpacity
                        style={styles.botaoCoracao}
                        onPress={() =>
                          removerFavorito(produto.id)
                        }
                      >
                        <Ionicons
                          name="heart"
                          size={isDesktop ? 19 : 17}
                          color="#000000"
                        />
                      </TouchableOpacity>
                    </View>

                    <Text style={styles.precoAntigo}>
                      {produto.precoAntigo}
                    </Text>

                    <Text
                      style={[
                        styles.preco,
                        { fontSize: isDesktop ? 13 : 11 },
                      ]}
                    >
                      {produto.preco}
                    </Text>

                    <TouchableOpacity
                      style={styles.botaoSacola}
                      onPress={() => adicionarSacola(produto)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.textoBotaoSacola}>
                        Adicionar ao carrinho
                      </Text>
                    </TouchableOpacity>

                    {editando && (
                      <TouchableOpacity
                        style={styles.botaoRemover}
                        onPress={() =>
                          removerFavorito(produto.id)
                        }
                      >
                        <Text style={styles.textoRemover}>
                          Remover dos favoritos
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </View>

              <View
                style={[
                  styles.banner,
                  {
                    marginHorizontal: isDesktop ? 10 : 4,
                  },
                ]}
              >
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
            </>
          )}

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

  vazio: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 65,
    paddingBottom: 75,
  },

  textoVazio: {
    color: '#888888',
    fontSize: 13,
    marginTop: 17,
  },

  botaoExplorarVazio: {
    backgroundColor: '#000000',
    paddingHorizontal: 22,
    paddingVertical: 12,
    marginTop: 22,
  },

  textoBotaoExplorar: {
    color: '#FFFFFF',
    fontSize: 10,
    letterSpacing: 1,
  },

  cabecalhoFavoritos: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 30,
    marginBottom: 25,
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

  botaoEditar: {
    width: 75,
    height: 28,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },

  textoEditar: {
    fontSize: 11,
    color: '#FFFFFF',
  },

  grade: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 28,
  },

  cardProduto: {
    marginBottom: 5,
    minWidth: 0,
  },

  containerImagem: {
    width: '100%',
    aspectRatio: 0.82,
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
    marginTop: 8,
    minHeight: 32,
    gap: 5,
  },

  nomeProduto: {
    flex: 1,
    lineHeight: 16,
    color: '#111111',
  },

  botaoCoracao: {
    paddingLeft: 3,
    paddingBottom: 3,
  },

  precoAntigo: {
    fontSize: 9,
    color: '#AAAAAA',
    textDecorationLine: 'line-through',
    marginTop: 3,
  },

  preco: {
    color: '#111111',
    marginTop: 3,
  },

  botaoSacola: {
    minHeight: 32,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 9,
    paddingHorizontal: 4,
  },

  textoBotaoSacola: {
    fontSize: 10,
    color: '#FFFFFF',
  },

  botaoRemover: {
    alignSelf: 'center',
    paddingTop: 9,
    paddingBottom: 3,
  },

  textoRemover: {
    fontSize: 10,
    color: '#444444',
    textDecorationLine: 'underline',
  },

  banner: {
    minHeight: 65,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginTop: 35,
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
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginLeft: 8,
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
