
import { useCallback, useState } from 'react';

import {
  Alert,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ImageSourcePropType,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useFavoritos } from '../hooks/useFavoritos';
import { listarProdutosCadastrados } from '../data/produtosCadastrados';
import { getUserRole } from '../auth/session';

type ProdutoCatalogo = {
  id: string;
  nome: string;
  antigo: string;
  preco: string;
  imagem: ImageSourcePropType;
  cadastrado: boolean;
};

export default function Catalogo() {
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
            setProdutosCadastrados(
              produtos.filter((produto) => produto.categoria === 'acessorios')
            );
          }
        })
        .catch((erro: unknown) => {
          console.error('Erro ao carregar acessórios cadastrados:', erro);
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
    ...produtosCadastrados.map((produto) => ({
      id: produto.id,
      nome: produto.nome,
      antigo: `R$ ${produto.precoOriginal.replace(/^R\$\s*/i, '').trim()}`,
      preco: `R$ ${produto.precoDesconto.replace(/^R\$\s*/i, '').trim()}`,
      imagem: { uri: produto.imagens[0] },
      cadastrado: true,
    })),
  ];

  function abrirProduto(id: string, cadastrado: boolean) {
    if (cadastrado) {
      router.push({ pathname: '/produto2', params: { id } });
      return;
    }

    router.push({ pathname: '/produto1', params: { id } });
  }

  return (
    <SafeAreaView style={styles.tela}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
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
              <Ionicons name="arrow-back-outline" size={25} color="#111111" />
            </TouchableOpacity>

            {isAdmin && (
              <TouchableOpacity
                style={styles.botaoAdicionar}
                onPress={() => router.push('/cadProduto')}
                accessibilityRole="button"
                accessibilityLabel="Adicionar produto"
              >
                <Ionicons name="add" size={27} color="#111111" />
              </TouchableOpacity>
            )}

            <Text style={styles.logo}>BELLAVER</Text>
            <Text style={styles.ano}>EST. 1972</Text>
            <TouchableOpacity style={styles.menu}>
              <Ionicons name="menu-outline" size={27} color="#111111" />
            </TouchableOpacity>
          </View>

          <View style={styles.linha} />

          <Text style={styles.titulo}>NOVIDADES</Text>

          <View style={styles.grade}>
            {produtos.map((produto) => (
              <View key={produto.id} style={styles.cardProduto}>
                <TouchableOpacity
                  style={styles.containerImagem}
                  onPress={() => abrirProduto(produto.id, produto.cadastrado)}
                >
                  <Image
                    source={produto.imagem}
                    style={styles.imagem}
                    resizeMode="cover"
                  />
                </TouchableOpacity>

                <View style={styles.linhaNome}>
                  <TouchableOpacity
                    style={styles.nomeClicavel}
                    onPress={() => abrirProduto(produto.id, produto.cadastrado)}
                  >
                    <Text style={styles.nomeProduto}>{produto.nome}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => alternarFavorito(produto.id)}
                    style={styles.coracao}
                  >
                    <Ionicons
                      name={favoritos.includes(produto.id) ? 'heart' : 'heart-outline'}
                      size={16}
                      color={favoritos.includes(produto.id) ? '#111111' : '#222222'}
                    />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  onPress={() => abrirProduto(produto.id, produto.cadastrado)}
                >
                  <Text style={styles.precoAntigo}>{produto.antigo}</Text>
                  <Text style={styles.precoAtual}>{produto.preco}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <Text style={styles.rodape}>BELLAVER® - 2026</Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  container: {
    flex: 1,
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#222222',
  },

  cabecalho: {
    height: 112,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  logo: {
    fontSize: 28,
    fontWeight: '300',
    letterSpacing: 6,
    color: '#080808',
  },

  ano: {
    fontSize: 11,
    color: '#111111',
    marginTop: 5,
  },

  botaoVoltar: {
    position: 'absolute',
    left: 12,
    top: 23,
    padding: 3,
  },

  botaoAdicionar: {
    position: 'absolute',
    left: 42,
    top: 23,
    padding: 3,
  },

  menu: {
    position: 'absolute',
    right: 12,
    top: 23,
    padding: 3,
  },

  linha: {
    height: 1,
    backgroundColor: '#BBBBBB',
    marginHorizontal: 15,
  },

  titulo: {
    textAlign: 'center',
    fontSize: 9,
    color: '#999999',
    marginTop: 17,
    marginBottom: 17,
  },

  grade: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },

  cardProduto: {
    width: '47%',
    marginBottom: 19,
  },

  containerImagem: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#EEEEEE',
  },

  imagem: {
    width: '100%',
    height: '100%',
  },

  linhaNome: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginTop: 7,
  },

  nomeProduto: {
    flex: 1,
    fontSize: 10,
    color: '#111111',
    lineHeight: 13,
    marginRight: 3,
  },

  nomeClicavel: {
    flex: 1,
  },

  coracao: {
    paddingLeft: 2,
    paddingTop: 1,
  },

  precoAntigo: {
    fontSize: 7,
    color: '#999999',
    textDecorationLine: 'line-through',
    marginTop: 2,
  },

  precoAtual: {
    fontSize: 9,
    color: '#111111',
    marginTop: 1,
  },

  rodape: {
    textAlign: 'center',
    color: '#888888',
    fontSize: 8,
    marginTop: 15,
    marginBottom: 20,
  },
});
