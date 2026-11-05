
import React, { useState } from 'react';
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
} from 'react-native';

const produtos = [
  {
    id: '1',
    nome: 'Vestido Longo',
    precoAntigo: 'R$ 1.450,00',
    preco: 'R$ 897,00',
    imagem: require('../../assets/Img/VestidoLongoAzul.png'),
  },
  {
    id: '2',
    nome: 'Conjunto Social',
    precoAntigo: 'R$ 780,00',
    preco: 'R$ 597,00',
    imagem: require('../../assets/Img/ConjuntoSocialPreto.png'),
  },
  {
    id: '3',
    nome: 'Trench Coat',
    precoAntigo: 'R$ 600,00',
    preco: 'R$ 320,00',
    imagem: require('../../assets/Img/TrenchCoatAlfaiataria.png'),
  },
];

const pesquisasIniciais = [
  'Vestido Devoré-Pattern mini - Gucci',
  'GG Marmont Quilted min bag - Gucci',
  'Boulevard Slingback pumps - Gucci',
];

export default function Pesquisa() {
  const [pesquisa, setPesquisa] = useState('');
  const [recentes, setRecentes] = useState(pesquisasIniciais);
  const [mostrarRecentes, setMostrarRecentes] = useState(true);
  const [favoritos, setFavoritos] = useState<string[]>([]);

  function pesquisar(texto?: string) {
    const termo = (texto || pesquisa).trim();

    if (termo === '') {
      Alert.alert('Pesquisar', 'Digite o nome de um produto.');
      return;
    }

    setPesquisa(termo);

    if (!recentes.includes(termo)) {
      setRecentes([termo, ...recentes].slice(0, 5));
    }

    Alert.alert('Pesquisa', 'Você pesquisou por: ' + termo);
  }

  function alternarFavorito(id: string) {
    if (favoritos.includes(id)) {
      setFavoritos(favoritos.filter((item) => item !== id));
    } else {
      setFavoritos([...favoritos, id]);
    }
  }

  function abrirFiltros() {
    Alert.alert(
      'Buscar por filtros',
      'Em breve você poderá filtrar por categoria, tamanho, marca e preço.'
    );
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
            Sugestões para você
          </Text>

          <View style={styles.listaProdutos}>
            {produtos.map((produto) => (
              <View style={styles.produto} key={produto.id}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => pesquisar(produto.nome)}
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
    justifyContent: 'space-between',
  },

  produto: {
    width: '26%',
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
