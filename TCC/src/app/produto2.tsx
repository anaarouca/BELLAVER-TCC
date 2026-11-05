import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import {
  atualizarImagemProduto,
  buscarProdutoCadastrado,
  persistirImagemProduto,
  ProdutoCadastrado,
  removerProdutoCadastrado,
} from '../data/produtosCadastrados';

export default function ProdutoCadastradoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [produto, setProduto] = useState<ProdutoCadastrado | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erroCarregamento, setErroCarregamento] = useState(false);
  const [imagemAtual, setImagemAtual] = useState(0);
  const [imagemComErro, setImagemComErro] = useState(false);
  const [alterandoImagem, setAlterandoImagem] = useState(false);
  const [confirmarExclusao, setConfirmarExclusao] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState('');
  const [quantidade, setQuantidade] = useState('1');
  const [favorito, setFavorito] = useState(false);

  useEffect(() => {
    let ativo = true;

    if (!id) {
      setCarregando(false);
      return;
    }

    buscarProdutoCadastrado(id)
      .then((produtoEncontrado) => {
        if (ativo) {
          setProduto(produtoEncontrado ?? null);
          setTamanhoSelecionado(produtoEncontrado?.tamanhos[0] ?? '');
        }
      })
      .catch((erro: unknown) => {
        console.error('Erro ao carregar produto cadastrado:', erro);
        if (ativo) {
          setErroCarregamento(true);
        }
        Alert.alert(
          'Erro ao carregar produto',
          erro instanceof Error
            ? erro.message
            : 'Não foi possível carregar os dados deste produto.'
        );
      })
      .finally(() => {
        if (ativo) {
          setCarregando(false);
        }
      });

    return () => {
      ativo = false;
    };
  }, [id]);

  if (carregando) {
    return (
      <View style={styles.estado}>
        <ActivityIndicator color="#111111" />
      </View>
    );
  }

  if (!produto) {
    return (
      <View style={styles.estado}>
        <Text style={styles.mensagemVazia}>
          {erroCarregamento
            ? 'Não foi possível carregar este produto.'
            : 'Produto não encontrado.'}
        </Text>
        <TouchableOpacity onPress={() => router.replace('/catalogo')}>
          <Text style={styles.linkVoltar}>Voltar ao catálogo</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const imagens = produto.imagens;
  const imagem = imagens[imagemAtual];
  async function trocarImagem() {
    try {
      const permissao =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissao.granted) {
        Alert.alert(
          'Permissão necessária',
          'Permita o acesso à galeria para escolher outra imagem.'
        );
        return;
      }

      const resultado = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.6,
        base64: true,
      });

      if (resultado.canceled || !resultado.assets[0]) {
        return;
      }

      setAlterandoImagem(true);
      const asset = resultado.assets[0];
      const imagemSalva = await persistirImagemProduto(
        {
          uri: asset.uri,
          base64: asset.base64,
          mimeType: asset.mimeType,
        },
        imagemAtual
      );
      const produtoAtualizado = await atualizarImagemProduto(
        produtoAtual.id,
        imagemSalva,
        imagemAtual
      );
      setProduto(produtoAtualizado);
      setImagemComErro(false);
    } catch (erro) {
      console.error('Erro ao trocar imagem do produto:', erro);
      Alert.alert(
        'Erro ao salvar imagem',
        erro instanceof Error
          ? erro.message
          : 'Não foi possível trocar a imagem. Tente novamente.'
      );
    } finally {
      setAlterandoImagem(false);
    }
  }

  const produtoAtual = produto;
  const precoOriginal = produto.precoOriginal.replace(/^R\$\s*/i, '').trim();
  const precoDesconto = produto.precoDesconto.replace(/^R\$\s*/i, '').trim();
  const medidasPorTamanho: Record<
    string,
    { busto: string; comprimento: string }
  > = {
    '36': { busto: '88', comprimento: '60' },
    '38': { busto: '92', comprimento: '60' },
    '40': { busto: '96', comprimento: '60' },
    '42': { busto: '100', comprimento: '60' },
  };

  function alterarQuantidade(valor: string) {
    const numero = Number(valor);
    if (valor === '' || (/^\d+$/.test(valor) && numero <= 99)) {
      setQuantidade(valor);
    }
  }

  function validarCompra(): boolean {
    const quantidadeNumerica = Number(quantidade);
    if (!tamanhoSelecionado) {
      Alert.alert('Atenção', 'Selecione um tamanho.');
      return false;
    }
    if (
      !Number.isInteger(quantidadeNumerica) ||
      quantidadeNumerica < 1 ||
      quantidadeNumerica > produtoAtual.estoque
    ) {
      Alert.alert(
        'Quantidade indisponível',
        `Este produto tem ${produtoAtual.estoque} unidade(s) em estoque.`
      );
      return false;
    }
    return true;
  }

  function adicionarCarrinho() {
    if (validarCompra()) {
      Alert.alert(
        'Produto adicionado!',
        `${produtoAtual.nome}\nTamanho: ${tamanhoSelecionado}\nQuantidade: ${quantidade}`
      );
    }
  }

  function comprarAgora() {
    if (validarCompra()) {
      Alert.alert(
        'Comprar agora',
        `Produto: ${produtoAtual.nome}\nTamanho: ${tamanhoSelecionado}\nQuantidade: ${quantidade}`
      );
    }
  }

  async function excluirProduto() {
    setExcluindo(true);
    try {
      await removerProdutoCadastrado(produtoAtual.id);
      router.replace('/catalogo');
    } catch (erro) {
      console.error('Erro ao excluir produto:', erro);
      Alert.alert(
        'Erro ao excluir',
        erro instanceof Error
          ? erro.message
          : 'Não foi possível excluir o produto. Tente novamente.'
      );
    } finally {
      setExcluindo(false);
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.conteudo}
      >
        <View style={styles.cabecalho}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.voltar}>‹ Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.logo}>BELLAVER</Text>
          <View style={styles.espaco} />
        </View>

        <View style={styles.divisoria} />

        <View style={styles.galeria}>
          {imagens.length > 1 && (
            <TouchableOpacity
              style={styles.seta}
              onPress={() => {
                setImagemComErro(false);
                setImagemAtual((atual) =>
                  atual === 0 ? imagens.length - 1 : atual - 1
                );
              }}
              accessibilityLabel="Imagem anterior"
            >
              <Text style={styles.textoSeta}>‹</Text>
            </TouchableOpacity>
          )}
          {imagem && !imagemComErro ? (
            <Image
              source={{ uri: imagem }}
              style={styles.imagem}
              resizeMode="cover"
              onError={() => setImagemComErro(true)}
              onLoad={() => setImagemComErro(false)}
            />
          ) : (
            <View style={[styles.imagem, styles.imagemVazia]}>
              <Text>
                {imagemComErro ? 'Imagem não carregou' : 'Sem imagem'}
              </Text>
            </View>
          )}
          {imagens.length > 1 && (
            <TouchableOpacity
              style={styles.seta}
              onPress={() => {
                setImagemComErro(false);
                setImagemAtual((atual) => (atual + 1) % imagens.length)
              }}
              accessibilityLabel="Próxima imagem"
            >
              <Text style={styles.textoSeta}>›</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.acoesImagem}>
          <TouchableOpacity
            style={styles.botaoTrocarImagem}
            onPress={trocarImagem}
            disabled={alterandoImagem || excluindo}
            activeOpacity={0.8}
          >
            <Text style={styles.textoTrocarImagem}>
              {alterandoImagem ? 'Salvando imagem...' : 'Trocar imagem'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.botaoExcluir}
            onPress={() => setConfirmarExclusao(true)}
            disabled={alterandoImagem || excluindo}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Excluir produto"
          >
            <Ionicons name="trash-outline" size={18} color="#A32D2D" />
            <Text style={styles.textoExcluir}>Excluir Produto</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.informacoes}>
          <View style={styles.linhaNome}>
            <Text style={styles.nome}>{produto.nome}</Text>
            <TouchableOpacity
              onPress={() => setFavorito((atual) => !atual)}
              accessibilityLabel={
                favorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos'
              }
            >
              <Text style={styles.coracao}>{favorito ? '♥' : '♡'}</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.precoOriginal}>R$ {precoOriginal}</Text>
          <Text style={styles.precoAtual}>R$ {precoDesconto}</Text>

          <View style={styles.opcoes}>
            <View style={styles.areaTamanhos}>
              <Text style={styles.tituloSecao}>Tamanho</Text>
              <View style={styles.tamanhos}>
                {produto.tamanhos.map((tamanho) => (
                  <TouchableOpacity
                    key={tamanho}
                    style={[
                      styles.tamanho,
                      tamanhoSelecionado === tamanho && styles.tamanhoAtivo,
                    ]}
                    onPress={() => setTamanhoSelecionado(tamanho)}
                    accessibilityRole="button"
                    accessibilityState={{
                      selected: tamanhoSelecionado === tamanho,
                    }}
                  >
                    <Text
                      style={[
                        styles.textoTamanho,
                        tamanhoSelecionado === tamanho &&
                          styles.textoTamanhoAtivo,
                      ]}
                    >
                      {tamanho}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={styles.areaQuantidade}>
              <Text style={styles.tituloSecao}>Quantidade</Text>
              <TextInput
                style={styles.inputQuantidade}
                value={quantidade}
                onChangeText={alterarQuantidade}
                keyboardType="numeric"
                maxLength={2}
                accessibilityLabel="Quantidade do produto"
              />
            </View>
          </View>

          <Text style={styles.estoque}>
            {produto.estoque > 0
              ? `${produto.estoque} unidade(s) em estoque`
              : 'Produto fora de estoque'}
          </Text>

          <TouchableOpacity
            style={[
              styles.botaoPrincipal,
              produto.estoque === 0 && styles.botaoDesabilitado,
            ]}
            onPress={adicionarCarrinho}
            disabled={produto.estoque === 0}
            activeOpacity={0.8}
          >
            <Text style={styles.textoBotao}>Adicionar ao carrinho</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.botaoPrincipal,
              produto.estoque === 0 && styles.botaoDesabilitado,
            ]}
            onPress={comprarAgora}
            disabled={produto.estoque === 0}
            activeOpacity={0.8}
          >
            <Text style={styles.textoBotao}>Comprar já</Text>
          </TouchableOpacity>

          <Text style={styles.tituloSecao}>Descrição</Text>
          <Text style={styles.descricao}>{produto.descricao}</Text>
        </View>
        <View style={styles.areaTabela}>
          <View style={styles.linhaTabela}>
            <Text style={[styles.celula, styles.cabecalhoTabela]}>
              Tabela de medidas
            </Text>
            {produto.tamanhos.map((tamanho) => (
              <Text
                key={tamanho}
                style={[styles.celula, styles.cabecalhoTabela]}
              >
                {tamanho}
              </Text>
            ))}
          </View>
          <View style={styles.linhaTabela}>
            <Text style={styles.celula}>Busto</Text>
            {produto.tamanhos.map((tamanho) => (
              <Text key={tamanho} style={styles.celula}>
                {medidasPorTamanho[tamanho]?.busto ?? '-'}
              </Text>
            ))}
          </View>
          <View style={styles.linhaTabela}>
            <Text style={styles.celula}>Comprimento</Text>
            {produto.tamanhos.map((tamanho) => (
              <Text key={tamanho} style={styles.celula}>
                {medidasPorTamanho[tamanho]?.comprimento ?? '-'}
              </Text>
            ))}
          </View>
        </View>
      </ScrollView>
      <Modal
        visible={confirmarExclusao}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (!excluindo) {
            setConfirmarExclusao(false);
          }
        }}
      >
        <View style={styles.fundoModal}>
          <View style={styles.conteudoModal}>
            <Text style={styles.tituloModal}>Excluir produto?</Text>
            <Text style={styles.textoModal}>
              Tem certeza que deseja excluir {produto.nome}? Essa ação não pode
              ser desfeita.
            </Text>
            <View style={styles.acoesModal}>
              <TouchableOpacity
                style={styles.botaoCancelar}
                onPress={() => setConfirmarExclusao(false)}
                disabled={excluindo}
                activeOpacity={0.8}
              >
                <Text style={styles.textoCancelar}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.botaoConfirmarExclusao, excluindo && styles.botaoDesabilitado]}
                onPress={excluirProduto}
                disabled={excluindo}
                activeOpacity={0.8}
              >
                <Text style={styles.textoConfirmarExclusao}>
                  {excluindo ? 'Excluindo...' : 'Excluir'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  conteudo: {
    paddingHorizontal: 20,
    paddingBottom: 36,
  },
  estado: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    gap: 14,
  },
  mensagemVazia: {
    color: '#111111',
    fontSize: 16,
  },
  linkVoltar: {
    color: '#555555',
    textDecorationLine: 'underline',
  },
  cabecalho: {
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  voltar: {
    width: 70,
    color: '#111111',
    fontSize: 14,
  },
  logo: {
    color: '#111111',
    fontSize: 24,
    fontWeight: '300',
    letterSpacing: 5,
  },
  espaco: {
    width: 70,
  },
  divisoria: {
    height: 1,
    backgroundColor: '#BBBBBB',
  },
  galeria: {
    minHeight: 300,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 18,
  },
  seta: {
    width: 32,
    alignItems: 'center',
  },
  textoSeta: {
    color: '#111111',
    fontSize: 32,
  },
  imagem: {
    width: '78%',
    height: 300,
    backgroundColor: '#EEEEEE',
  },
  imagemVazia: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  acoesImagem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 14,
  },
  botaoTrocarImagem: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#999999',
    borderRadius: 3,
  },
  botaoExcluir: {
    minHeight: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#D9A5A5',
    borderRadius: 3,
  },
  textoExcluir: {
    color: '#A32D2D',
    fontSize: 12,
    fontWeight: '600',
  },
  textoTrocarImagem: {
    color: '#333333',
    fontSize: 12,
  },
  fundoModal: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  conteudoModal: {
    width: '100%',
    maxWidth: 380,
    padding: 22,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  tituloModal: {
    color: '#111111',
    fontSize: 18,
    fontWeight: '600',
  },
  textoModal: {
    color: '#555555',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 10,
  },
  acoesModal: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 22,
  },
  botaoCancelar: {
    minWidth: 96,
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    backgroundColor: '#EEEEEE',
    borderRadius: 3,
  },
  textoCancelar: {
    color: '#222222',
    fontSize: 13,
    fontWeight: '600',
  },
  botaoConfirmarExclusao: {
    minWidth: 96,
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    backgroundColor: '#A32D2D',
    borderRadius: 3,
  },
  textoConfirmarExclusao: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  informacoes: {
    paddingHorizontal: 8,
  },
  nome: {
    flex: 1,
    color: '#111111',
    fontSize: 19,
    lineHeight: 25,
  },
  linhaNome: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  coracao: {
    color: '#111111',
    fontSize: 25,
    marginLeft: 10,
  },
  precoOriginal: {
    color: '#999999',
    fontSize: 13,
    textDecorationLine: 'line-through',
    marginTop: 10,
  },
  precoAtual: {
    color: '#111111',
    fontSize: 18,
    marginTop: 3,
  },
  tituloSecao: {
    color: '#111111',
    fontSize: 15,
    fontWeight: '600',
    marginTop: 22,
    marginBottom: 10,
  },
  tamanhos: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
  },
  tamanho: {
    minWidth: 38,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEEEEE',
    borderRadius: 3,
    paddingHorizontal: 8,
  },
  textoTamanho: {
    color: '#111111',
    fontSize: 12,
  },
  tamanhoAtivo: {
    backgroundColor: '#111111',
  },
  textoTamanhoAtivo: {
    color: '#FFFFFF',
  },
  opcoes: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  areaTamanhos: {
    flex: 1,
  },
  areaQuantidade: {
    alignItems: 'center',
    marginLeft: 12,
  },
  inputQuantidade: {
    width: 48,
    height: 32,
    borderWidth: 1,
    borderColor: '#999999',
    borderRadius: 3,
    textAlign: 'center',
    padding: 0,
    color: '#111111',
  },
  estoque: {
    color: '#555555',
    fontSize: 12,
    marginTop: 12,
  },
  botaoPrincipal: {
    minHeight: 42,
    backgroundColor: '#111111',
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  botaoDesabilitado: {
    opacity: 0.5,
  },
  textoBotao: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  descricao: {
    color: '#333333',
    fontSize: 14,
    lineHeight: 21,
  },
  areaTabela: {
    marginHorizontal: 8,
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
