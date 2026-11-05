
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Alert,
  TextInput,
} from 'react-native';
import { router } from 'expo-router';

export default function ProdutoScreen() {
  const [tamanho, setTamanho] = useState('36');
  const [quantidade, setQuantidade] = useState('1');
  const [favorito, setFavorito] = useState(false);
  const [imagemAtual, setImagemAtual] = useState(0);

  const tamanhos = ['36', '38', '40', '42'];

  const imagens = [
    require('../../assets/Img/TailleurCinzaRose.png'),
    require('../../assets/Img/TailleurCinzaRose1.jpg'),
    require('../../assets/Img/TailleurCinzaRose2.jpg'),
  ];

  const descricao =
    'Conjunto de três peças em alfaiataria premium. Blazer oversized estruturado, calça pantalona de cintura alta e camisa em tricotine acetinada Rose Quartz. Design de linhas precisas que une a sobriedade do cinza à energia da cor. O novo padrão da autoridade feminina.';

  function adicionarCarrinho() {
    if (!tamanho) {
      Alert.alert('Atenção', 'Selecione um tamanho.');
      return;
    }

    Alert.alert(
      'Produto adicionado!',
      `Tailleur Cinza & Rose Quartz\nTamanho: ${tamanho}\nQuantidade: ${quantidade}`
    );
  }

  function comprarAgora() {
    if (!tamanho) {
      Alert.alert('Atenção', 'Selecione um tamanho.');
      return;
    }

    Alert.alert(
      'Comprar agora',
      `Produto: Tailleur Cinza & Rose Quartz\nTamanho: ${tamanho}\nQuantidade: ${quantidade}`
    );
  }

  function alterarQuantidade(valor: string) {
    const numero = Number(valor);

    if (valor === '' || (/^\d+$/.test(valor) && numero >= 1 && numero <= 99)) {
      setQuantidade(valor);
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.conteudo}
      >
        {/* CABEÇALHO */}
        <View style={styles.cabecalho}>
          <View style={styles.espacoLateral} />

          <TouchableOpacity
            style={styles.logoContainer}
            onPress={() => router.replace('/home')}
          >
            <Text style={styles.logo}>BELLAVER</Text>
            <Text style={styles.subLogo}>EST. 1972</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menu}
            onPress={() => router.back()}
          >
            <View style={styles.linhaMenu} />
            <View style={styles.linhaMenu} />
            <View style={styles.linhaMenu} />
          </TouchableOpacity>
        </View>

        <View style={styles.divisoria} />

        {/* IMAGEM DO PRODUTO */}
        <View style={styles.areaImagem}>
          <TouchableOpacity
            style={styles.seta}
            onPress={() =>
              setImagemAtual((atual) =>
                atual === 0 ? imagens.length - 1 : atual - 1
              )
            }
          >
            <Text style={styles.textoSeta}>‹</Text>
          </TouchableOpacity>

          <Image
            source={imagens[imagemAtual]}
            style={styles.imagemProduto}
            resizeMode="cover"
          />

          <TouchableOpacity
            style={styles.seta}
            onPress={() =>
              setImagemAtual((atual) =>
                atual === imagens.length - 1 ? 0 : atual + 1
              )
            }
          >
            <Text style={styles.textoSeta}>›</Text>
          </TouchableOpacity>
        </View>

        {/* INFORMAÇÕES DO PRODUTO */}
        <View style={styles.informacoes}>
          <View style={styles.linhaNome}>
            <Text style={styles.nomeProduto}>
              Tailleur Cinza & Rose Quartz | Ana Paula Renault Edition
            </Text>

            <TouchableOpacity onPress={() => setFavorito(!favorito)}>
              <Text style={styles.coracao}>
                {favorito ? '♥' : '♡'}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.precoOriginal}>R$ 789,00</Text>
          <Text style={styles.precoAtual}>R$ 597,00</Text>
        </View>

        {/* TAMANHO E QUANTIDADE */}
        <View style={styles.opcoes}>
          <View style={styles.areaTamanho}>
            <Text style={styles.label}>Tamanho</Text>

            <View style={styles.listaTamanhos}>
              {tamanhos.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.botaoTamanho,
                    tamanho === item && styles.tamanhoSelecionado,
                  ]}
                  onPress={() => setTamanho(item)}
                >
                  <Text
                    style={[
                      styles.textoTamanho,
                      tamanho === item && styles.textoTamanhoSelecionado,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.areaQuantidade}>
            <Text style={styles.label}>Quantidade</Text>

            <TextInput
              style={styles.inputQuantidade}
              value={quantidade}
              onChangeText={alterarQuantidade}
              keyboardType="numeric"
              maxLength={2}
            />
          </View>
        </View>

        {/* BOTÕES */}
        <TouchableOpacity
          style={styles.botaoPrincipal}
          onPress={adicionarCarrinho}
          activeOpacity={0.8}
        >
          <Text style={styles.textoBotao}>Adicionar ao carrinho</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoPrincipal}
          onPress={comprarAgora}
          activeOpacity={0.8}
        >
          <Text style={styles.textoBotao}>Comprar já</Text>
        </TouchableOpacity>

        {/* DESCRIÇÃO */}
        <View style={styles.areaDescricao}>
          <Text style={styles.tituloDescricao}>Descrição</Text>

          <Text style={styles.textoDescricao}>{descricao}</Text>
        </View>

        {/* TABELA DE MEDIDAS */}
        <View style={styles.areaTabela}>
          <View style={styles.linhaTabela}>
            <Text style={[styles.celula, styles.cabecalhoTabela]}>
              Tabela de medidas
            </Text>
            {tamanhos.map((item) => (
              <Text key={item} style={[styles.celula, styles.cabecalhoTabela]}>
                {item}
              </Text>
            ))}
          </View>

          <View style={styles.linhaTabela}>
            <Text style={styles.celula}>Busto</Text>
            {['88', '92', '96', '100'].map((item, index) => (
              <Text key={index} style={styles.celula}>
                {item}
              </Text>
            ))}
          </View>

          <View style={styles.linhaTabela}>
            <Text style={styles.celula}>Comprimento</Text>
            {['60', '60', '60', '60'].map((item, index) => (
              <Text key={index} style={styles.celula}>
                {item}
              </Text>
            ))}
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
    paddingHorizontal: 13,
    paddingBottom: 35,
  },

  cabecalho: {
    height: 110,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  espacoLateral: {
    width: 28,
  },

  logoContainer: {
    alignItems: 'center',
    marginTop: 3,
  },

  logo: {
    fontSize: 29,
    fontWeight: '300',
    letterSpacing: 7,
    color: '#111111',
  },

  subLogo: {
    fontSize: 11,
    color: '#111111',
    marginTop: 7,
  },

  menu: {
    width: 28,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },

  linhaMenu: {
    width: 17,
    height: 1,
    backgroundColor: '#111111',
  },

  divisoria: {
    height: 2,
    backgroundColor: '#BDBDBD',
    marginHorizontal: 0,
  },

  areaImagem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 13,
    marginBottom: 26,
  },

  seta: {
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },

  textoSeta: {
    fontSize: 32,
    color: '#111111',
  },

  imagemProduto: {
    width: '62%',
    height: 294,
    backgroundColor: '#EEEEEE',
  },

  informacoes: {
    marginHorizontal: 12,
  },

  linhaNome: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },

  nomeProduto: {
    flex: 1,
    fontSize: 15,
    lineHeight: 19,
    color: '#111111',
  },

  coracao: {
    fontSize: 22,
    color: '#111111',
    marginLeft: 8,
  },

  precoOriginal: {
    fontSize: 12,
    color: '#999999',
    textDecorationLine: 'line-through',
    marginTop: 4,
  },

  precoAtual: {
    fontSize: 16,
    color: '#111111',
    marginTop: 1,
  },

  opcoes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginHorizontal: 17,
    marginTop: 17,
    marginBottom: 14,
  },

  areaTamanho: {
    flex: 1,
  },

  label: {
    fontSize: 10,
    color: '#111111',
    marginBottom: 12,
  },

  listaTamanhos: {
    flexDirection: 'row',
    gap: 9,
  },

  botaoTamanho: {
    width: 34,
    height: 22,
    backgroundColor: '#EEEEEE',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },

  tamanhoSelecionado: {
    backgroundColor: '#000000',
  },

  textoTamanho: {
    fontSize: 10,
    color: '#111111',
  },

  textoTamanhoSelecionado: {
    color: '#FFFFFF',
  },

  areaQuantidade: {
    alignItems: 'center',
    marginLeft: 8,
  },

  inputQuantidade: {
    width: 42,
    height: 19,
    borderWidth: 1,
    borderColor: '#999999',
    borderRadius: 3,
    textAlign: 'center',
    padding: 0,
    fontSize: 11,
    color: '#111111',
  },

  botaoPrincipal: {
    height: 35,
    backgroundColor: '#000000',
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 28,
    marginBottom: 9,
  },

  textoBotao: {
    fontSize: 12,
    color: '#FFFFFF',
  },

  areaDescricao: {
    marginHorizontal: 17,
    marginTop: 17,
  },

  tituloDescricao: {
    fontSize: 11,
    fontWeight: '600',
    color: '#111111',
    marginBottom: 12,
  },

  textoDescricao: {
    fontSize: 10,
    lineHeight: 13,
    color: '#111111',
  },

  areaTabela: {
    marginHorizontal: 25,
    marginTop: 27,
  },

  linhaTabela: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 31,
    borderBottomWidth: 1,
    borderBottomColor: '#888888',
  },

  celula: {
    flex: 1,
    textAlign: 'center',
    fontSize: 10,
    color: '#111111',
  },

  cabecalhoTabela: {
    fontWeight: '400',
  },
});
