
import React, { useEffect, useState } from 'react';
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
import { onAuthStateChanged } from 'firebase/auth';
import {
  CATEGORIAS_PRODUTO,
  ImagemProdutoNova,
  obterTamanhosDisponiveis,
  persistirImagemProduto,
  salvarProdutoCadastrado,
  CategoriaProduto,
} from '../data/produtosCadastrados';
import {
  ADMIN_EMAIL,
  clearUserRole,
  getUserRole,
} from '../auth/session';
import { auth } from '../firebaseConfig';

export default function CadastroProdutoScreen() {
  const [nome, setNome] = useState('');
  const [precoOriginal, setPrecoOriginal] = useState('');
  const [precoDesconto, setPrecoDesconto] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState<CategoriaProduto | null>(null);
  const [imagens, setImagens] = useState<(ImagemProdutoNova | null)[]>([
    null,
    null,
    null,
  ]);
  const [estoque, setEstoque] = useState(1);
  const [tamanhosSelecionados, setTamanhosSelecionados] = useState(['36']);
  const [salvando, setSalvando] = useState(false);
  const [autorizado, setAutorizado] = useState(false);
  const tamanhos = obterTamanhosDisponiveis(categoria, nome);
  const tamanhosSelecionadosValidos = tamanhosSelecionados.filter((tamanho) =>
    tamanhos.includes(tamanho)
  );

  useEffect(() => {
    let ativo = true;
    const unsubscribe = onAuthStateChanged(auth, (usuario) => {
      void (async () => {
        const role = await getUserRole();
        const acessoValido =
          role === 'admin' &&
          usuario?.email?.toLowerCase() === ADMIN_EMAIL &&
          usuario.emailVerified;

        if (!ativo) {
          return;
        }

        if (!acessoValido) {
          await clearUserRole();
          Alert.alert(
            'Acesso restrito',
            'Entre novamente com a conta de administrador verificada.'
          );
          router.replace('/loginAdm');
          return;
        }

        setAutorizado(true);
      })().catch((erro: unknown) => {
        console.error('Erro ao verificar acesso ao cadastro:', erro);
        if (ativo) {
          Alert.alert(
            'Erro de autenticação',
            'Não foi possível verificar sua sessão. Entre novamente.'
          );
          router.replace('/loginAdm');
        }
      });
    });

    return () => {
      ativo = false;
      unsubscribe();
    };
  }, []);

  function sincronizarTamanhosSelecionados(
    novaCategoria: CategoriaProduto | null,
    novoNome: string
  ) {
    const tamanhosDisponiveis = obterTamanhosDisponiveis(
      novaCategoria,
      novoNome
    );
    setTamanhosSelecionados((atuais) => {
      const selecionadosValidos = atuais.filter((tamanho) =>
        tamanhosDisponiveis.includes(tamanho)
      );
      if (selecionadosValidos.length > 0) {
        return selecionadosValidos;
      }

      return novaCategoria === 'acessorios'
        ? tamanhosDisponiveis
        : tamanhosDisponiveis.slice(0, 1);
    });
  }

  function alterarNome(novoNome: string) {
    setNome(novoNome);
    sincronizarTamanhosSelecionados(categoria, novoNome);
  }

  if (!autorizado) {
    return null;
  }
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
      });

      if (!resultado.canceled && resultado.assets.length > 0) {
        const asset = resultado.assets[0];
        const novasImagens = [...imagens];
        novasImagens[indice] = {
          uri: asset.uri,
          width: asset.width,
          height: asset.height,
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
    if (!tamanhos.includes(tamanho)) {
      return;
    }

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
      !categoria ||
      !imagens.some((imagem) => imagem !== null) ||
      (tamanhos.length > 0 && tamanhosSelecionadosValidos.length === 0)
    ) {
      Alert.alert('Atenção', 'Preencha todos os campos antes de salvar.');
      return;
    }

    const usuario = auth.currentUser;
    if (
      !usuario ||
      usuario.email?.toLowerCase() !== ADMIN_EMAIL ||
      !usuario.emailVerified
    ) {
      Alert.alert(
        'Sessão expirada',
        'Entre novamente com a conta de administrador verificada para salvar o produto.'
      );
      router.replace('/loginAdm');
      return;
    }

    setSalvando(true);
    try {
      const imagensPersistidas = await Promise.all(
        imagens
          .map((imagem) =>
            imagem ? persistirImagemProduto(imagem) : null
          )
          .filter((imagem): imagem is Promise<string> => imagem !== null)
      );
      const produtoSalvo = await salvarProdutoCadastrado({
        nome: nome.trim(),
        categoria,
        precoOriginal: precoOriginal.trim(),
        precoDesconto: precoDesconto.trim(),
        descricao: descricao.trim(),
        imagens: imagensPersistidas,
        estoque,
        tamanhos: tamanhosSelecionadosValidos,
      });

      router.replace({
        pathname: '/mensagem',
        params: {
          id: produtoSalvo.id,
          nome: produtoSalvo.nome,
          categoria: produtoSalvo.categoria,
        },
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
          <TouchableOpacity
            style={styles.botaoVoltar}
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace('/loginAdm');
              }
            }}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
          >
            <Ionicons name="arrow-back-outline" size={25} color="#111111" />
          </TouchableOpacity>

          <View style={styles.logoContainer}>
            <Text style={styles.logo}>BELLAVER</Text>
            <Text style={styles.subLogo}>EST. 1972</Text>
          </View>

          <TouchableOpacity
            style={styles.menu}
            onPress={() => router.push('/menu')}
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
            onChangeText={alterarNome}
          />

          <Text style={styles.label}>Categoria do Produto</Text>
          <View style={styles.listaCategorias}>
            {CATEGORIAS_PRODUTO.map((opcao) => {
              const selecionada = categoria === opcao.valor;
              return (
                <TouchableOpacity
                  key={opcao.valor}
                  style={[
                    styles.botaoCategoria,
                    selecionada && styles.categoriaSelecionada,
                  ]}
                  onPress={() => {
                    setCategoria(opcao.valor);
                    sincronizarTamanhosSelecionados(opcao.valor, nome);
                  }}
                  accessibilityRole="button"
                  accessibilityState={{ selected: selecionada }}
                  accessibilityLabel={`Categoria ${opcao.nome}`}
                >
                  <Text
                    style={[
                      styles.textoCategoria,
                      selecionada && styles.textoCategoriaSelecionada,
                    ]}
                  >
                    {opcao.nome}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

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

          {tamanhos.length > 0 && (
            <>
              <Text style={[styles.label, styles.labelTamanhos]}>
                Tamanhos disponíveis
              </Text>
              <View style={styles.listaTamanhos}>
                {tamanhos.map((tamanho) => {
                  const selecionado =
                    tamanhosSelecionadosValidos.includes(tamanho);
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
            </>
          )}

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

  botaoVoltar: {
    width: 28,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
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

  listaCategorias: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },

  botaoCategoria: {
    minHeight: 30,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#111111',
    borderRadius: 3,
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center',
  },

  categoriaSelecionada: {
    backgroundColor: '#000000',
  },

  textoCategoria: {
    fontSize: 11,
    color: '#111111',
  },

  textoCategoriaSelecionada: {
    color: '#FFFFFF',
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
