
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
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

export default function Catalogo() {
  const [favoritos, setFavoritos] = useState<number[]>([]);

  const produtos = [
    {
      id: 1,
      nome: 'Anel de Ouro com Pérola Barroca Escultural',
      antigo: 'R$ 11.800,00',
      preco: 'R$ 9.850,00',
      imagem: require('../../assets/Img/AneldeOuro.png'),
    },
    {
      id: 2,
      nome: 'Anel Duplo Escultural em Ouro 18k',
      antigo: 'R$ 8.900,00',
      preco: 'R$ 7.565,00',
      imagem: require('../../assets/Img/AnelDuplo.png'),
    },
    {
      id: 3,
      nome: 'Brincos de Argola Dupla em Prata de Lei Texturizada',
      antigo: 'R$ 12.500,00',
      preco: 'R$ 10.400,00',
      imagem: require('../../assets/Img/ArgolaDupla.png'),
    },
    {
      id: 4,
      nome: 'Conjunto de Pulseiras de Tênis de Diamantes',
      antigo: 'R$ 3.800,00',
      preco: 'R$ 3.230,00',
      imagem: require('../../assets/Img/ConjuntodePulseiras.png'),
    },
    {
      id: 5,
      nome: 'Brincos de Argola Esculturais Orgânicos em Ouro',
      antigo: 'R$ 2.800,00',
      preco: 'R$ 2.250,00',
      imagem: require('../../assets/Img/BrincoArgola.png'),
    },
    {
      id: 6,
      nome: 'Conjunto Relógio Cartier Tank e Pulseira Clover',
      antigo: 'R$ 6.500,00',
      preco: 'R$ 5.400,00',
      imagem: require('../../assets/Img/ConjuntoRelogio.png'),
    },
  ];

  function alternarFavorito(id: number) {
    if (favoritos.includes(id)) {
      setFavoritos(favoritos.filter((item) => item !== id));
    } else {
      setFavoritos([...favoritos, id]);
    }
  }

  return (
    <SafeAreaView style={styles.tela}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.cabecalho}>
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
                <View style={styles.containerImagem}>
                  <Image
                    source={produto.imagem}
                    style={styles.imagem}
                    resizeMode="cover"
                  />
                </View>

                <View style={styles.linhaNome}>
                  <Text style={styles.nomeProduto}>{produto.nome}</Text>

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

                <Text style={styles.precoAntigo}>{produto.antigo}</Text>
                <Text style={styles.precoAtual}>{produto.preco}</Text>
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
