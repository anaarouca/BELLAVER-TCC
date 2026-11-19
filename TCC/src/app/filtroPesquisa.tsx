import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { salvarFiltrosPesquisa } from '../data/filtrosPesquisa';

export default function Filtros() {
  const { origem, tamanho, preco, categoria } = useLocalSearchParams<{
    origem?: string;
    tamanho?: string;
    preco?: string;
    categoria?: string;
  }>();
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState<string | null>(
    typeof tamanho === 'string' && tamanho ? tamanho : null
  );

  const [precoSelecionado, setPrecoSelecionado] = useState<number | null>(
    () => {
      const indice = preco?.trim() ? Number(preco) : Number.NaN;
      return Number.isInteger(indice) && indice >= 0 && indice <= 4
        ? indice
        : 2;
    }
  );

  const [categoriaSelecionada, setCategoriaSelecionada] =
    useState(
      typeof categoria === 'string' && categoria
        ? categoria
        : 'Todas as Categorias'
    );

  const [menuCategoriaAberto, setMenuCategoriaAberto] = useState(false);

  const tamanhos = ['36', '38', '40', '42', '44'];

  const precos = ['R$ 0', 'R$ 125', 'R$ 250', 'R$ 375', 'R$ 500+'];

  const categorias = [
    'Todas as Categorias',
    'Feminino',
    'Masculino',
    'Calçados',
    'Acessórios',
  ];

  const limparFiltros = () => {
    setTamanhoSelecionado(null);
    setPrecoSelecionado(null);
    setCategoriaSelecionada('Todas as Categorias');
    setMenuCategoriaAberto(false);
  };

  const aplicarFiltros = () => {
    void salvarFiltrosPesquisa({
      tamanho: tamanhoSelecionado,
      preco: precoSelecionado,
      categoria: categoriaSelecionada,
    })
      .then(() => {
        if (origem === 'pesquisa' && router.canGoBack()) {
          router.back();
        } else {
          router.replace('/pesquisa');
        }
      })
      .catch((erro: unknown) => {
        console.error('Erro ao salvar filtros de pesquisa:', erro);
        Alert.alert(
          'Não foi possível aplicar os filtros',
          'Tente novamente.'
        );
      });
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.conteudo}
        showsVerticalScrollIndicator={false}
      >
        {/* CABEÇALHO */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>BELLAVER</Text>
            <Text style={styles.logoSubtitulo}>EST. 1972</Text>
          </View>

          <TouchableOpacity
            style={styles.menuButton}
            activeOpacity={0.7}
            onPress={() => router.push('/menu')}
          >
            <View style={styles.linhaMenu} />
            <View style={styles.linhaMenu} />
            <View style={styles.linhaMenu} />
          </TouchableOpacity>
        </View>

        <View style={styles.linhaSeparadora} />

        {/* TÍTULO E VOLTAR */}
        <View style={styles.tituloContainer}>
          <TouchableOpacity
            style={styles.botaoVoltar}
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace('/pesquisa');
              }
            }}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Voltar para pesquisa"
          >
            <Text style={styles.setaVoltar}>‹</Text>
          </TouchableOpacity>

          <Text style={styles.titulo}>Filtros</Text>
        </View>

        {/* TAMANHO */}
        <View style={styles.secaoTamanho}>
          <Text style={styles.label}>Tamanho</Text>

          <View style={styles.listaTamanhos}>
            {tamanhos.map((tamanho) => {
              const selecionado = tamanhoSelecionado === tamanho;

              return (
                <TouchableOpacity
                  key={tamanho}
                  style={[
                    styles.botaoTamanho,
                    selecionado && styles.tamanhoSelecionado,
                  ]}
                  onPress={() =>
                    setTamanhoSelecionado(
                      selecionado ? null : tamanho
                    )
                  }
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.textoTamanho,
                      selecionado && styles.textoTamanhoSelecionado,
                    ]}
                  >
                    {tamanho}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* VALOR DA PEÇA */}
        <View style={styles.secaoPreco}>
          <Text style={styles.label}>Valor da Peça</Text>

          <View style={styles.precoContainer}>
            <View style={styles.linhaPrecos} />

            {precos.map((preco, index) => {
              const selecionado = precoSelecionado === index;

              return (
                <TouchableOpacity
                  key={preco}
                  style={styles.pontoPreco}
                  onPress={() => setPrecoSelecionado(index)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.textoPreco}>
                    {preco}
                  </Text>

                  <View
                    style={[
                      styles.circuloPreco,
                      selecionado && styles.circuloPrecoSelecionado,
                    ]}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* CATEGORIA */}
        <View style={styles.secaoCategoria}>
          <Text style={styles.label}>Categoria</Text>

          <TouchableOpacity
            style={styles.seletor}
            activeOpacity={0.7}
            onPress={() => {
              setMenuCategoriaAberto(!menuCategoriaAberto);
            }}
          >
            <Text style={styles.textoSeletor}>
              {categoriaSelecionada}
            </Text>

            <Text style={styles.setaSeletor}>
              {menuCategoriaAberto ? '⌃' : '⌄'}
            </Text>
          </TouchableOpacity>

          {menuCategoriaAberto && (
            <View style={styles.opcoesDropdown}>
              {categorias.map((categoria) => (
                <TouchableOpacity
                  key={categoria}
                  style={styles.opcaoDropdown}
                  onPress={() => {
                    setCategoriaSelecionada(categoria);
                    setMenuCategoriaAberto(false);
                  }}
                >
                  <Text style={styles.textoOpcao}>
                    {categoria}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* BOTÕES */}
        <View style={styles.botoesContainer}>
          <TouchableOpacity
            style={styles.botaoLimpar}
            onPress={limparFiltros}
            activeOpacity={0.7}
          >
            <Text style={styles.textoBotaoLimpar}>
              LIMPAR FILTROS
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.botaoAplicar}
            onPress={aplicarFiltros}
            activeOpacity={0.8}
          >
            <Text style={styles.textoBotaoAplicar}>
              APLICAR FILTROS
            </Text>
          </TouchableOpacity>
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

  scroll: {
    flex: 1,
  },

  conteudo: {
    paddingHorizontal: 15,
    paddingBottom: 30,
  },

  // CABEÇALHO

  header: {
    height: 122,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  logoContainer: {
    alignItems: 'center',
    marginTop: 12,
  },

  logo: {
    fontSize: 28,
    fontWeight: '300',
    letterSpacing: 6,
    color: '#080808',
  },

  logoSubtitulo: {
    fontSize: 11,
    color: '#111111',
    marginTop: 7,
    fontWeight: '400',
  },

  menuButton: {
    position: 'absolute',
    right: 10,
    top: 34,
    width: 22,
    height: 24,
    justifyContent: 'space-between',
    paddingVertical: 2,
  },

  linhaMenu: {
    width: 18,
    height: 1,
    backgroundColor: '#111111',
  },

  linhaSeparadora: {
    height: 1,
    backgroundColor: '#BDBDBD',
  },

  // TÍTULO

  tituloContainer: {
    height: 65,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  botaoVoltar: {
    position: 'absolute',
    left: 10,
    width: 28,
    height: 40,
    justifyContent: 'center',
  },

  setaVoltar: {
    fontSize: 32,
    lineHeight: 36,
    color: '#111111',
    fontWeight: '300',
  },

  titulo: {
    fontSize: 20,
    fontWeight: '600',
    color: '#080808',
  },

  // TAMANHO

  secaoTamanho: {
    marginTop: 8,
  },

  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111111',
    marginLeft: 13,
  },

  listaTamanhos: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 17,
    marginHorizontal: 20,
  },

  botaoTamanho: {
    width: 44,
    height: 38,
    borderWidth: 1,
    borderColor: '#111111',
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },

  tamanhoSelecionado: {
    backgroundColor: '#000000',
  },

  textoTamanho: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111111',
  },

  textoTamanhoSelecionado: {
    color: '#FFFFFF',
  },

  // VALOR DA PEÇA

  secaoPreco: {
    marginTop: 49,
  },

  precoContainer: {
    height: 58,
    marginTop: 28,
    marginHorizontal: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'relative',
  },

  linhaPrecos: {
    position: 'absolute',
    left: 10,
    right: 10,
    top: 20,
    height: 1.5,
    backgroundColor: '#444444',
  },

  pontoPreco: {
    width: 25,
    alignItems: 'center',
    position: 'relative',
    height: 48,
  },

  textoPreco: {
    position: 'absolute',
    top: -7,
    width: 66,
    left: -20.5,
    textAlign: 'center',
    fontSize: 10,
    fontWeight: '600',
    color: '#111111',
  },

  circuloPreco: {
    position: 'absolute',
    top: 12,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#111111',
    backgroundColor: '#FFFFFF',
  },

  circuloPrecoSelecionado: {
    backgroundColor: '#000000',
  },

  seletor: {
    height: 51,
    borderWidth: 1,
    borderColor: '#111111',
    borderRadius: 3,
    marginTop: 16,
    paddingHorizontal: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  textoSeletor: {
    fontSize: 15,
    color: '#111111',
    fontWeight: '500',
  },

  setaSeletor: {
    fontSize: 25,
    lineHeight: 28,
    color: '#111111',
    marginRight: 2,
  },

  opcoesDropdown: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#111111',
    borderRadius: 3,
    marginTop: 3,
  },

  opcaoDropdown: {
    minHeight: 42,
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#DDDDDD',
  },

  textoOpcao: {
    fontSize: 14,
    color: '#111111',
  },

  // CATEGORIA

  secaoCategoria: {
    marginTop: 18,
    marginHorizontal: 13,
    zIndex: 1,
  },

  // BOTÕES INFERIORES

  botoesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 27,
    gap: 19,
  },

  botaoLimpar: {
    flex: 1,
    height: 51,
    borderWidth: 1,
    borderColor: '#111111',
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },

  textoBotaoLimpar: {
    fontSize: 14,
    color: '#111111',
    fontWeight: '600',
  },

  botaoAplicar: {
    flex: 1,
    height: 51,
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
  },

  textoBotaoAplicar: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});