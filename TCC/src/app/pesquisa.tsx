
import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Alert,
  SafeAreaView,
  ImageSourcePropType,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { listarProdutosCadastrados } from '../data/produtosCadastrados';

const produtos = [
  {
    id: '1',
    nome: 'Blusa em organza de seda Branco',
    precoAntigo: 'R$ 890,00',
    preco: 'R$ 760,00',
    imagem: require('../../assets/Img/BlusaEmOrganza.png'),
  },
  {
    id: '2',
    nome: 'Set Denim Grand Icon Azul Gisele Edition',
    precoAntigo: 'R$ 1.480,00',
    preco: 'R$ 1.197,00',
    imagem: require('../../assets/Img/SetDenimGrand.png'),
  },
  {
    id: '3',
    nome: 'Gown Saint Tropez Branco',
    precoAntigo: 'R$ 1.280,00',
    preco: 'R$ 897,00',
    imagem: require('../../assets/Img/GownSaint.png'),
  },
  {
    id: '4',
    nome: 'Trench Coat Alfaiataria Preto',
    precoAntigo: 'R$ 3.500,00',
    preco: 'R$ 320,00',
    imagem: require('../../assets/Img/TrenchCoatAlfaiataria.png'),
  },
  {
    id: '5',
    nome: 'Vestido Longo Azul-Marinho',
    precoAntigo: 'R$ 1.140,00',
    preco: 'R$ 897,00',
    imagem: require('../../assets/Img/VestidoLongoAzul.png'),
  },
  {
    id: '6',
    nome: 'Conjunto Social Preto e Branco',
    precoAntigo: 'R$ 780,00',
    preco: 'R$ 597,00',
    imagem: require('../../assets/Img/ConjuntoSocialPreto.png'),
  },
  {
    id: '7',
    nome: 'Conjunto Alfaiataria Off-White',
    precoAntigo: 'R$ 899,00',
    preco: 'R$ 697,00',
    imagem: require('../../assets/Img/ConjuntoAlfaiatariaOff.png'),
  },
  {
    id: '8',
    nome: 'Colete Alfaiataria Risca de Giz Hudson',
    precoAntigo: 'R$ 389,00',
    preco: 'R$ 297,00',
    imagem: require('../../assets/Img/ColeteAlfaiatariaRisca.png'),
  },
  {
    id: '9',
    nome: 'Tailleur Cinza & Rose Quartz | Ana Paula Renault',
    precoAntigo: 'R$ 780,00',
    preco: 'R$ 597,00',
    imagem: require('../../assets/Img/TailleurCinzaRose.png'),
  },
];

const pesquisasIniciais = [
  'Vestido Devoré-Pattern mini - Gucci',
  'GG Marmont Quilted min bag - Gucci',
  'Boulevard Slingback pumps - Gucci',
];

type ProdutoPesquisa = {
  id: string;
  nome: string;
  precoAntigo: string;
  preco: string;
  imagem: ImageSourcePropType;
  cadastrado: boolean;
};

function normalizarTexto(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
    .trim();
}

export default function Pesquisa() {
  const [pesquisa, setPesquisa] = useState('');
  const [recentes, setRecentes] = useState(pesquisasIniciais);
  const [mostrarRecentes, setMostrarRecentes] = useState(true);
  const [favoritos, setFavoritos] = useState<string[]>([]);
  const [produtosCadastrados, setProdutosCadastrados] = useState<
    Awaited<ReturnType<typeof listarProdutosCadastrados>>
  >([]);

  useFocusEffect(
    useCallback(() => {
      let ativo = true;

      listarProdutosCadastrados()
        .then((produtos) => {
          if (ativo) {
            setProdutosCadastrados(produtos);
          }
        })
        .catch((erro: unknown) => {
          console.error('Erro ao carregar produtos para pesquisa:', erro);
          Alert.alert(
            'Erro ao carregar produtos',
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

  const todosProdutos: ProdutoPesquisa[] = [
    ...produtos.map((produto) => ({
      ...produto,
      cadastrado: false,
    })),
    ...produtosCadastrados.map((produto) => ({
      id: produto.id,
      nome: produto.nome,
      precoAntigo: `R$ ${produto.precoOriginal.replace(/^R\$\s*/i, '').trim()}`,
      preco: `R$ ${produto.precoDesconto.replace(/^R\$\s*/i, '').trim()}`,
      imagem: { uri: produto.imagens[0] },
      cadastrado: true,
    })),
  ];

  const termoPesquisa = normalizarTexto(pesquisa);
  const resultados = termoPesquisa
    ? todosProdutos.filter((produto) =>
        normalizarTexto(produto.nome).includes(termoPesquisa)
      )
    : todosProdutos.slice(0, 3);

  function pesquisar(texto?: string) {
    const termo = (texto || pesquisa).trim();

    if (termo === '') {
      Alert.alert('Pesquisar', 'Digite o nome de um produto.');
      return;
    }

    setPesquisa(termo);

    setRecentes((atuais) => {
      const semRepeticao = atuais.filter(
        (recente) => normalizarTexto(recente) !== normalizarTexto(termo)
      );
      return [termo, ...semRepeticao].slice(0, 5);
    });
  }

  function alternarFavorito(id: string) {
    if (favoritos.includes(id)) {
      setFavoritos(favoritos.filter((item) => item !== id));
    } else {
      setFavoritos([...favoritos, id]);
    }
  }

  function abrirFiltros() {
    router.push('/filtroPesquisa');
  }

  function limparHistorico() {
    setRecentes([]);
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* CABEÇALHO */}
        <View style={styles.cabecalho}>
          <TouchableOpacity
            style={styles.menu}
            onPress={() => Alert.alert('Menu', 'Menu de navegação')}
          >
            <View style={styles.linhaMenu} />
            <View style={styles.linhaMenu} />
            <View style={styles.linhaMenu} />
          </TouchableOpacity>

          <Text style={styles.logo}>BELLAVER</Text>
          <Text style={styles.subLogo}>EST. 1972</Text>
        </View>

        <View style={styles.linhaSeparadora} />

        {/* PESQUISA */}
        <View style={styles.conteudo}>
          <Text style={styles.titulo}>Pesquisar</Text>

          <View style={styles.campoPesquisa}>
            <TouchableOpacity onPress={() => pesquisar()}>
              <Text style={styles.iconePesquisa}>⌕</Text>
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="Buscar roupas, calçados e mais..."
              placeholderTextColor="#888888"
              value={pesquisa}
              onChangeText={setPesquisa}
              onSubmitEditing={() => pesquisar()}
              returnKeyType="search"
            />
          </View>

          {/* SUGESTÕES */}
          <Text style={styles.tituloSugestoes}>
            {termoPesquisa ? 'Resultados da pesquisa' : 'Sugestões para você'}
          </Text>

          {resultados.length > 0 ? (
            <View style={styles.listaProdutos}>
              {resultados.map((produto) => (
                <View style={styles.produto} key={produto.id}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      if (produto.cadastrado) {
                        router.push({
                          pathname: '/produto2',
                          params: { id: produto.id },
                        });
                      } else {
                        pesquisar(produto.nome);
                      }
                    }}
                  >
                    <Image
                      source={produto.imagem}
                      style={styles.imagemProduto}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>

                  <View style={styles.nomeEFavorito}>
                    <Text style={styles.nomeProduto}>
                      {produto.nome}
                    </Text>

                    <TouchableOpacity
                      onPress={() => alternarFavorito(produto.id)}
                    >
                      <Text style={styles.coracao}>
                        {favoritos.includes(produto.id) ? '♥' : '♡'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.precoAntigo}>
                    {produto.precoAntigo}
                  </Text>

                  <Text style={styles.preco}>
                    {produto.preco}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.semResultados}>
              <Text style={styles.textoSemResultados}>
                Peça não encontrada
              </Text>
              <Text style={styles.dicaSemResultados}>
                Tente buscar por outro nome ou tipo de peça.
              </Text>
            </View>
          )}

          {/* PESQUISAS RECENTES */}
          <TouchableOpacity
            style={styles.tituloRecentes}
            onPress={() => setMostrarRecentes(!mostrarRecentes)}
          >
            <Text style={styles.textoRecentes}>
              Pesquisas recentes
            </Text>

            <Text style={styles.seta}>
              {mostrarRecentes ? '⌄' : '⌃'}
            </Text>
          </TouchableOpacity>

          {mostrarRecentes && (
            <View style={styles.listaRecentes}>
              {recentes.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.itemRecente}
                  onPress={() => pesquisar(item)}
                >
                  <Text
                    style={styles.textoRecente}
                    numberOfLines={1}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* BOTÃO DE FILTROS */}
          <TouchableOpacity
            style={styles.botaoFiltros}
            onPress={abrirFiltros}
          >
            <Text style={styles.textoBotao}>
              BUSCAR POR FILTROS
            </Text>

            <View style={styles.iconeFiltro}>
              <View style={styles.filtroLinha1} />
              <View style={styles.filtroLinha2} />
              <View style={styles.filtroLinha3} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.botaoLimparHistorico}
            onPress={limparHistorico}
            activeOpacity={0.7}
          >
            <Text style={styles.textoLimparHistorico}>
              LIMPAR HISTÓRICO
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  cabecalho: {
    height: 122,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  menu: {
    position: 'absolute',
    right: 27,
    top: 32,
    width: 19,
    height: 22,
    justifyContent: 'space-between',
    paddingVertical: 2,
  },

  linhaMenu: {
    height: 1,
    width: 17,
    backgroundColor: '#111111',
  },

  logo: {
    fontSize: 28,
    fontWeight: '300',
    letterSpacing: 6,
    color: '#111111',
    marginTop: 10,
  },

  subLogo: {
    fontSize: 11,
    color: '#111111',
    marginTop: 8,
  },

  linhaSeparadora: {
    height: 1,
    backgroundColor: '#AAAAAA',
    marginHorizontal: 15,
  },

  conteudo: {
    paddingHorizontal: 32,
    paddingTop: 24,
    paddingBottom: 35,
  },

  titulo: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111111',
    marginBottom: 24,
  },

  campoPesquisa: {
    height: 52,
    borderWidth: 1,
    borderColor: '#AAAAAA',
    borderRadius: 3,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },

  iconePesquisa: {
    fontSize: 29,
    color: '#111111',
    marginRight: 12,
    transform: [{ rotate: '-20deg' }],
  },

  input: {
    flex: 1,
    fontSize: 14,
    color: '#111111',
    paddingVertical: 0,
  },

  tituloSugestoes: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111111',
    marginTop: 24,
    marginBottom: 22,
  },

  listaProdutos: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 18,
  },

  produto: {
    width: '30%',
  },

  semResultados: {
    minHeight: 105,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 3,
    padding: 16,
  },

  textoSemResultados: {
    color: '#222222',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },

  dicaSemResultados: {
    color: '#777777',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 6,
  },

  imagemProduto: {
    width: '100%',
    height: 83,
    backgroundColor: '#EEEEEE',
  },

  nomeEFavorito: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 7,
  },

  nomeProduto: {
    fontSize: 12,
    color: '#222222',
    flex: 1,
  },

  coracao: {
    fontSize: 14,
    color: '#444444',
    marginLeft: 2,
  },

  precoAntigo: {
    fontSize: 8,
    color: '#999999',
    textDecorationLine: 'line-through',
    marginTop: 1,
  },

  preco: {
    fontSize: 9,
    color: '#222222',
    marginTop: 1,
  },

  tituloRecentes: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 29,
    marginBottom: 21,
  },

  textoRecentes: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111111',
  },

  seta: {
    fontSize: 25,
    color: '#111111',
    marginTop: -8,
  },

  listaRecentes: {
    gap: 12,
  },

  itemRecente: {
    height: 51,
    borderWidth: 1,
    borderColor: '#AAAAAA',
    borderRadius: 3,
    justifyContent: 'center',
    paddingHorizontal: 15,
  },

  textoRecente: {
    fontSize: 16,
    color: '#111111',
  },

  botaoFiltros: {
    height: 51,
    backgroundColor: '#000000',
    borderRadius: 3,
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  botaoLimparHistorico: {
    alignSelf: 'center',
    marginTop: 18,
    paddingVertical: 2,
  },

  textoLimparHistorico: {
    color: '#A0A0A0',
    fontSize: 11,
    fontWeight: '400',
  },

  textoBotao: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  iconeFiltro: {
    width: 18,
    height: 19,
    marginLeft: 14,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },

  filtroLinha1: {
    width: 16,
    height: 1.5,
    backgroundColor: '#FFFFFF',
  },

  filtroLinha2: {
    width: 11,
    height: 1.5,
    backgroundColor: '#FFFFFF',
  },

  filtroLinha3: {
    width: 6,
    height: 1.5,
    backgroundColor: '#FFFFFF',
  },
});
