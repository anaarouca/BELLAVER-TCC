
import { useCallback, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  ImageSourcePropType,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useFavoritos } from '../hooks/useFavoritos';
import { listarProdutosCadastrados } from '../data/produtosCadastrados';
import { getUserRole } from '../auth/session';

type ProdutoCatalogo = {
  id: string;
  nome: string;
  original: string;
  preco: string;
  imagem: ImageSourcePropType;
  cadastrado: boolean;
};

function formatarPreco(preco: string): string {
  return `R$ ${preco.replace(/^R\$\s*/i, '').trim()}`;
}

export default function CatalogoScreen() {
  const { favoritos, alternarFavorito } = useFavoritos();
  const [isAdmin, setIsAdmin] = useState(false);
  const [produtosCadastrados, setProdutosCadastrados] = useState<
    Awaited<ReturnType<typeof listarProdutosCadastrados>>
  >([]);

  useFocusEffect(
    useCallback(() => {
      let ativo = true;

      getUserRole()
        .then((role) => {
          if (ativo) {
            setIsAdmin(role === 'admin');
          }
        })
        .catch((erro: unknown) => {
          console.error('Erro ao verificar perfil:', erro);
        });

      listarProdutosCadastrados()
        .then((produtos) => {
          if (ativo) {
            setProdutosCadastrados(produtos);
          }
        })
        .catch((erro: unknown) => {
          console.error('Erro ao carregar produtos cadastrados:', erro);
          Alert.alert(
            'Erro ao carregar catálogo',
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

  const produtos: ProdutoCatalogo[] = [
    ...produtosCadastrados
      .filter((produto) => produto.categoria === 'feminino')
      .map((produto) => ({
        id: produto.id,
        nome: produto.nome,
        original: formatarPreco(produto.precoOriginal),
        preco: formatarPreco(produto.precoDesconto),
        imagem: { uri: produto.imagens[0] },
        cadastrado: true,
      })),
  ];

  function abrirProduto(id: string, cadastrado = false) {
    if (cadastrado) {
      router.push({ pathname: '/produto2', params: { id } });
      return;
    }

    router.push({
      pathname: '/produto1',
      params: { id },
    });
  }

  function favoritar(id: string) {
    alternarFavorito(id);
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.cabecalho}>
        <TouchableOpacity
          style={styles.botaoVoltar}
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

        {isAdmin ? (
          <TouchableOpacity
            style={styles.botaoAdicionar}
            onPress={() => router.push('/cadProduto')}
            accessibilityRole="button"
            accessibilityLabel="Adicionar produto"
          >
            <Ionicons name="add" size={27} color="#111111" />
          </TouchableOpacity>
        ) : (
          <View style={styles.espaco} />
        )}

        <View style={styles.marca}>
          <Text style={styles.logo}>BELLAVER</Text>
          <Text style={styles.estabelecimento}>EST. 1972</Text>
        </View>

        <TouchableOpacity
          style={styles.botaoMenu}
          onPress={() => router.push('/menu')}
        >
          <Ionicons
            name="menu-outline"
            size={28}
            color="#111111"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.divisorTopo} />

      <View style={styles.barraTitulo}>
        <Text style={styles.titulo}>NOVIDADES</Text>

        {!isAdmin && (
          <TouchableOpacity
            onPress={() => router.push('/pesquisar' as any)}
          >
            <Ionicons
              name="search-outline"
              size={19}
              color="#111111"
            />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.conteudo}
      >
        <View style={styles.grade}>
          {produtos.map((produto) => {
            const estaFavoritado = favoritos.includes(produto.id);

            return (
              <View style={styles.cardProduto} key={produto.id}>
                <TouchableOpacity
                  style={styles.areaImagem}
                  activeOpacity={0.8}
                  onPress={() => abrirProduto(produto.id, produto.cadastrado)}
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
                    onPress={() =>
                      abrirProduto(produto.id, produto.cadastrado)
                    }
                  >
                    <Text style={styles.nomeProduto}>{produto.nome}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.botaoFavorito}
                    activeOpacity={0.6}
                    onPress={() => favoritar(produto.id)}
                  >
                    <Ionicons
                      name={estaFavoritado ? 'heart' : 'heart-outline'}
                      size={19}
                      color="#111111"
                    />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  onPress={() =>
                    abrirProduto(produto.id, produto.cadastrado)
                  }
                >
                  <Text style={styles.precoOriginal}>
                    {produto.original}
                  </Text>

                  <Text style={styles.precoAtual}>
                    {produto.preco}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
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

  botaoVoltar: {
    width: 28,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },

  espaco: {
    width: 28,
  },

  botaoAdicionar: {
    width: 28,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
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
    width: 24,
    height: 22,
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
