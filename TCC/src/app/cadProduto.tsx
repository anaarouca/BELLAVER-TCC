
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import {
  ImagemProdutoNova,
  persistirImagemProduto,
  salvarProdutoCadastrado,
} from '../data/produtosCadastrados';

export default function CadastroProdutoScreen() {
  const [nome, setNome] = useState('');
  const [precoOriginal, setPrecoOriginal] = useState('');
  const [precoDesconto, setPrecoDesconto] = useState('');
  const [descricao, setDescricao] = useState('');
  const [imagens, setImagens] = useState<(ImagemProdutoNova | null)[]>([
    null,
    null,
    null,
  ]);
  const [estoque, setEstoque] = useState(1);
  const [tamanhosSelecionados, setTamanhosSelecionados] = useState(['36']);
  const [salvando, setSalvando] = useState(false);
  const tamanhos = ['36', '38', '40', '42'];

  async function selecionarImagem(indice: number) {
    const permissao =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissao.granted) {
      Alert.alert(
        'Permissão necessária',
        'Permita o acesso à galeria para escolher imagens do produto.'
      );
      return;
    }

    try {
      const resultado = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.6,
        base64: true,
      });

      if (!resultado.canceled && resultado.assets.length > 0) {
        const asset = resultado.assets[0];
        const novasImagens = [...imagens];
        novasImagens[indice] = {
          uri: asset.uri,
          base64: asset.base64,
          mimeType: asset.mimeType,
        };
        setImagens(novasImagens);
      }
    } catch (erro) {
      console.error('Erro ao selecionar imagem do produto:', erro);
      Alert.alert(
        'Erro ao selecionar imagem',
        erro instanceof Error
          ? erro.message
          : 'Não foi possível abrir a imagem. Tente novamente.'
      );
    }
  }

  function alterarEstoque(valor: number) {
    setEstoque((atual) => Math.max(0, atual + valor));
  }

  function alternarTamanho(tamanho: string) {
    setTamanhosSelecionados((atuais) =>
      atuais.includes(tamanho)
        ? atuais.filter((item) => item !== tamanho)
        : [...atuais, tamanho]
    );
  }

  async function salvarProduto() {
    if (
      !nome.trim() ||
      !precoOriginal.trim() ||
      !precoDesconto.trim() ||
      !descricao.trim() ||
      !imagens.some((imagem) => imagem !== null) ||
      tamanhosSelecionados.length === 0
    ) {
      Alert.alert('Atenção', 'Preencha todos os campos antes de salvar.');
      return;
    }

    setSalvando(true);
    try {
      const imagensPersistidas = await Promise.all(
        imagens
          .map((imagem, indice) =>
            imagem ? persistirImagemProduto(imagem, indice) : null
          )
          .filter((imagem): imagem is Promise<string> => imagem !== null)
      );
      const produtoSalvo = await salvarProdutoCadastrado({
        nome: nome.trim(),
        precoOriginal: precoOriginal.trim(),
        precoDesconto: precoDesconto.trim(),
        descricao: descricao.trim(),
        imagens: imagensPersistidas,
        estoque,
        tamanhos: tamanhosSelecionados,
      });

      router.replace({
        pathname: '/mensagem',
        params: { id: produtoSalvo.id, nome: produtoSalvo.nome },
      });
    } catch (erro) {
      console.error('Erro ao salvar produto:', erro);
      Alert.alert(
        'Erro ao salvar',
        erro instanceof Error
          ? erro.message
          : 'Não foi possível salvar o produto. Tente novamente.'
      );
    } finally {
      setSalvando(false);
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.conteudo}
        keyboardShouldPersistTaps="handled"
      >
        {/* CABEÇALHO */}
        <View style={styles.cabecalho}>
          <View style={styles.espacoLateral} />

          <View style={styles.logoContainer}>
            <Text style={styles.logo}>BELLAVER</Text>
            <Text style={styles.subLogo}>EST. 1972</Text>
          </View>

          <TouchableOpacity
            style={styles.menu}
            onPress={() => Alert.alert('Menu', 'Menu do administrador')}
          >
            <View style={styles.linhaMenu} />
            <View style={styles.linhaMenu} />
            <View style={styles.linhaMenu} />
          </TouchableOpacity>
        </View>

        <View style={styles.divisoria} />

        {/* IDENTIFICAÇÃO */}
        <Text style={styles.painel}>PAINEL DO ADMINISTRADOR</Text>

        <Text style={styles.titulo}>Cadastre um produto</Text>

        {/* FORMULÁRIO */}
        <View style={styles.formulario}>
          <Text style={styles.label}>Nome do Produto</Text>
          <TextInput
            style={styles.input}
            placeholder="Insira o nome do produto..."
            placeholderTextColor="#888888"
            value={nome}
            onChangeText={setNome}
          />

          <Text style={styles.label}>Preço Original do Produto</Text>
          <TextInput
            style={styles.input}
            placeholder="Insira o preço original do produto..."
            placeholderTextColor="#888888"
            value={precoOriginal}
            onChangeText={setPrecoOriginal}
            keyboardType="decimal-pad"
          />

          <Text style={styles.label}>Preço com Desconto do Produto</Text>
          <TextInput
            style={styles.input}
            placeholder="Insira o preço com desconto do produto..."
            placeholderTextColor="#888888"
            value={precoDesconto}
            onChangeText={setPrecoDesconto}
            keyboardType="decimal-pad"
          />

          <Text style={styles.label}>Descrição do Produto</Text>
          <TextInput
            style={styles.input}
            placeholder="Insira a descrição do produto..."
            placeholderTextColor="#888888"
            value={descricao}
            onChangeText={setDescricao}
          />

          <Text style={styles.label}>Quantidade em Estoque</Text>
          <View style={styles.controleEstoque}>
            <TouchableOpacity
              style={styles.ajusteEstoque}
              onPress={() => alterarEstoque(-1)}
              accessibilityRole="button"
              accessibilityLabel="Diminuir quantidade em estoque"
            >
              <Text style={styles.textoAjuste}>-</Text>
            </TouchableOpacity>
            <Text style={styles.valorEstoque}>{estoque}</Text>
            <TouchableOpacity
              style={styles.ajusteEstoque}
              onPress={() => alterarEstoque(1)}
              accessibilityRole="button"
              accessibilityLabel="Aumentar quantidade em estoque"
            >
              <Text style={styles.textoAjuste}>+</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.label, styles.labelTamanhos]}>
            Tamanhos disponíveis
          </Text>
          <View style={styles.listaTamanhos}>
            {tamanhos.map((tamanho) => {
              const selecionado = tamanhosSelecionados.includes(tamanho);
              return (
                <TouchableOpacity
                  key={tamanho}
                  style={[
                    styles.botaoTamanho,
                    selecionado && styles.tamanhoSelecionado,
                  ]}
                  onPress={() => alternarTamanho(tamanho)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: selecionado }}
                  accessibilityLabel={`Tamanho ${tamanho}`}
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

          <Text style={[styles.label, styles.labelImagens]}>
            Imagens do Produto
          </Text>
          <View style={styles.galeria}>
            {imagens.map((imagemAtual, indice) => (
              <TouchableOpacity
                key={indice}
                style={styles.botaoImagem}
                onPress={() => selecionarImagem(indice)}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={
                  imagemAtual
                    ? `Alterar imagem ${indice + 1} do produto`
                    : `Adicionar imagem ${indice + 1} do produto`
                }
              >
                {imagemAtual ? (
                  <Image
                    source={{
                      uri: imagemAtual.base64
                        ? `data:image/jpeg;base64,${imagemAtual.base64}`
                        : imagemAtual.uri,
                    }}
                    style={styles.imagemSelecionada}
                  />
                ) : (
                  <Ionicons
                    name={indice === 2 ? 'add-outline' : 'camera-outline'}
                    size={indice === 2 ? 38 : 29}
                    color="#111111"
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* BOTÃO SALVAR */}
          <TouchableOpacity
            style={[styles.botaoSalvar, salvando && styles.botaoDesabilitado]}
            onPress={salvarProduto}
            activeOpacity={0.8}
            disabled={salvando}
          >
            <Text style={styles.textoBotao}>
              {salvando ? 'Salvando...' : 'Salvar'}
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

  conteudo: {
    paddingHorizontal: 25,
    paddingBottom: 40,
  },

  cabecalho: {
    height: 109,
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
    marginHorizontal: -9,
  },

  painel: {
    fontSize: 9,
    color: '#999999',
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 27,
  },

  titulo: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111111',
    marginBottom: 15,
  },

  formulario: {
    borderWidth: 1,
    borderColor: '#111111',
    borderRadius: 4,
    paddingHorizontal: 18,
    paddingTop: 19,
    paddingBottom: 30,
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    backgroundColor: '#FFFFFF',
  },

  label: {
    fontSize: 15,
    color: '#111111',
    marginBottom: 6,
  },

  input: {
    height: 30,
    borderWidth: 1,
    borderColor: '#111111',
    borderRadius: 3,
    backgroundColor: '#EEEEEE',
    paddingHorizontal: 8,
    paddingVertical: 0,
    fontSize: 11,
    color: '#111111',
    marginBottom: 12,
  },

  controleEstoque: {
    height: 27,
    minWidth: 51,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#999999',
    borderRadius: 3,
    marginBottom: 17,
  },

  ajusteEstoque: {
    width: 18,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  textoAjuste: {
    fontSize: 10,
    color: '#111111',
  },

  valorEstoque: {
    minWidth: 15,
    textAlign: 'center',
    fontSize: 9,
    color: '#111111',
  },

  labelTamanhos: {
    marginBottom: 7,
  },

  listaTamanhos: {
    width: 208,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 17,
  },

  botaoTamanho: {
    minWidth: 31,
    height: 20,
    paddingHorizontal: 5,
    borderRadius: 3,
    backgroundColor: '#EEEEEE',
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

  labelImagens: {
    marginBottom: 6,
  },

  botaoSalvar: {
    width: 127,
    alignSelf: 'center',
    backgroundColor: '#000000',
    borderRadius: 3,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 35,
  },
  botaoDesabilitado: {
    opacity: 0.6,
  },

  galeria: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 24,
  },

  botaoImagem: {
    width: 85,
    height: 75,
    borderWidth: 1,
    borderColor: '#111111',
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  imagemSelecionada: {
    width: '100%',
    height: '100%',
  },

  textoBotao: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
});
