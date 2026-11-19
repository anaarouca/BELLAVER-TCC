
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSacola } from '../hooks/useSacola';

export default function PagamentoScreen() {
  const { itens, carregando, finalizarCompra } = useSacola();

  const [metodo, setMetodo] = useState('');
  const [numeroCartao, setNumeroCartao] = useState('');
  const [titular, setTitular] = useState('');
  const [validade, setValidade] = useState('');
  const [cvv, setCvv] = useState('');
  const [parcelamento, setParcelamento] = useState(1);
  const [mostrarParcelas, setMostrarParcelas] = useState(false);
  const [finalizando, setFinalizando] = useState(false);

  // VALORES REAIS DA SACOLA
  const subtotal = itens.reduce(
    (total, item) => total + item.preco * item.quantidade,
    0
  );

  const total = subtotal;

  const formatarPreco = (valor: number) =>
    valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });

  const quantidadeTotal = itens.reduce(
    (total, item) => total + item.quantidade,
    0
  );

  function selecionarMetodo(opcao: string) {
    const novoMetodo = metodo === opcao ? '' : opcao;
    setMetodo(novoMetodo);

    if (novoMetodo === 'boleto') {
      baixarBoleto();
    }
  }

  function baixarBoleto() {
    const conteudo = [
      'BOLETO BANCÁRIO BELLAVER',
      '',
      `Valor da compra: ${formatarPreco(total)}`,
      `Quantidade de itens: ${quantidadeTotal}`,
      '',
      'Este documento é uma simulação de boleto bancário.',
    ].join('\n');

    if (Platform.OS === 'web') {
      const arquivo = new Blob([conteudo], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(arquivo);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'BOLETO BANCÁRIO BELLAVER.txt';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      Alert.alert(
        'Boleto gerado',
        'O boleto foi gerado e o download foi iniciado.'
      );
      return;
    }

    Alert.alert(
      'Boleto gerado',
      'O boleto foi gerado. O download está disponível na versão web.'
    );
  }

  function formatarNumeroCartao(texto: string) {
    const numeros = texto.replace(/\D/g, '').slice(0, 16);

    setNumeroCartao(
      numeros.replace(/(\d{4})(?=\d)/g, '$1 ')
    );
  }

  function formatarValidade(texto: string) {
    const numeros = texto.replace(/\D/g, '').slice(0, 4);

    if (numeros.length > 2) {
      setValidade(
        numeros.slice(0, 2) + '/' + numeros.slice(2)
      );
    } else {
      setValidade(numeros);
    }
  }

  async function finalizarPagamento() {
    if (carregando) {
      return;
    }

    if (itens.length === 0) {
      Alert.alert('Sacola vazia', 'Adicione produtos antes de continuar.');
      return;
    }

    if (!metodo) {
      Alert.alert(
        'Atenção',
        'Selecione uma forma de pagamento.'
      );
      return;
    }

    if (metodo === 'cartao') {
      const numero = numeroCartao.replace(/\s/g, '');

      if (
        numero.length !== 16 ||
        !titular.trim() ||
        validade.length !== 5 ||
        cvv.length < 3
      ) {
        Alert.alert(
          'Dados incompletos',
          'Preencha corretamente os dados do cartão.'
        );
        return;
      }

      const [mes, ano] = validade.split('/');

      if (
        Number(mes) < 1 ||
        Number(mes) > 12 ||
        Number(ano) < 1
      ) {
        Alert.alert('Validade inválida', 'Confira a validade do cartão.');
        return;
      }
    }

    if (finalizando) {
      return;
    }

    setFinalizando(true);
    try {
      await finalizarCompra();
      router.replace('/mensagem2');
    } catch (erro: unknown) {
      Alert.alert(
        'Não foi possível finalizar',
        erro instanceof Error
          ? erro.message
          : 'Tente novamente em alguns instantes.'
      );
    } finally {
      setFinalizando(false);
    }
  }

  function LinhaPagamento({
    tipo,
    titulo,
    icone,
  }: {
    tipo: string;
    titulo: string;
    icone: React.ComponentProps<typeof Ionicons>['name'];
  }) {
    const selecionado = metodo === tipo;

    return (
      <TouchableOpacity
        style={[
          styles.opcaoPagamento,
          selecionado && styles.opcaoSelecionada,
        ]}
        onPress={() => selecionarMetodo(tipo)}
        activeOpacity={0.7}
      >
        <View style={styles.ladoOpcao}>
          <View style={styles.radio}>
            {selecionado && (
              <View style={styles.radioInterno} />
            )}
          </View>

          <Text style={styles.textoOpcao}>{titulo}</Text>
        </View>

        <Ionicons
          name={icone}
          size={21}
          color="#111111"
        />
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.conteudo}
        keyboardShouldPersistTaps="handled"
      >
        {/* CABEÇALHO */}
        <View style={styles.cabecalho}>
          <View style={styles.espaco} />

          <TouchableOpacity
            style={styles.logoContainer}
            onPress={() => router.replace('/home')}
          >
            <Text style={styles.logo}>BELLAVER</Text>
            <Text style={styles.subLogo}>EST. 1972</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menu}
            onPress={() => router.push('/menu')}
          >
            <Ionicons
              name="menu-outline"
              size={27}
              color="#111111"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.divisoriaTopo} />

        {/* VOLTAR */}
        <TouchableOpacity
          style={styles.voltar}
          onPress={() => router.replace('/sacola')}
        >
          <Ionicons
            name="arrow-back-outline"
            size={14}
            color="#777777"
          />

          <Text style={styles.textoVoltar}>
            VOLTAR PARA A SACOLA
          </Text>
        </TouchableOpacity>

        {/* TÍTULO */}
        <View style={styles.tituloArea}>
          <Text style={styles.titulo}>PAGAMENTO</Text>

          <Text style={styles.subtitulo}>
            ESCOLHA A MELHOR FORMA PARA VOCÊ
          </Text>
        </View>

        {/* PRODUTOS REAIS DA SACOLA */}
        <View style={styles.cardProdutos}>
          {carregando ? (
            <ActivityIndicator color="#111111" />
          ) : itens.length === 0 ? (
            <Text style={styles.sacolaVazia}>
              Sua sacola está vazia.
            </Text>
          ) : (
            itens.map((item) => (
              <View
                key={item.id}
                style={styles.produto}
              >
                {item.imagem ? (
                  <Image
                    source={{ uri: item.imagem }}
                    style={styles.imagemProduto}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.imagemSemFoto}>
                    <Ionicons
                      name="image-outline"
                      size={25}
                      color="#AAAAAA"
                    />
                  </View>
                )}

                <View style={styles.infoProduto}>
                  <Text
                    style={styles.nomeProduto}
                    numberOfLines={2}
                  >
                    {item.nome}
                  </Text>

                  <Text style={styles.detalheProduto}>
                    {item.tamanho
                      ? `Tamanho - ${item.tamanho}`
                      : 'Tamanho único'}
                  </Text>

                  <Text style={styles.detalheProduto}>
                    Qtd: {item.quantidade}
                  </Text>

                  <Text style={styles.precoProduto}>
                    {formatarPreco(item.preco * item.quantidade)}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>

        {/* RESUMO */}
        <View style={styles.resumo}>
          <View style={styles.linhaResumo}>
            <Text style={styles.textoResumo}>Subtotal</Text>

            <Text style={styles.textoResumo}>
              {formatarPreco(subtotal)}
            </Text>
          </View>

          <View style={styles.linhaResumo}>
            <Text style={styles.textoResumo}>Frete</Text>
            <Text style={styles.textoResumo}>Grátis</Text>
          </View>

          <View style={styles.linhaTotal}>
            <Text style={styles.textoTotal}>Total</Text>

            <Text style={styles.textoTotal}>
              {formatarPreco(total)}
            </Text>
          </View>
        </View>

        {/* FORMAS DE PAGAMENTO */}
        <Text style={styles.tituloMetodo}>
          MÉTODO DE PAGAMENTO
        </Text>

        {/* CARTÃO */}
        <LinhaPagamento
          tipo="cartao"
          titulo="CARTÃO DE CRÉDITO"
          icone="card-outline"
        />

        {metodo === 'cartao' && (
          <View style={styles.camposCartao}>
            <TextInput
              style={styles.input}
              placeholder="NÚMERO DO CARTÃO"
              placeholderTextColor="#C6C6C6"
              value={numeroCartao}
              onChangeText={formatarNumeroCartao}
              keyboardType="numeric"
              maxLength={19}
            />

            <TextInput
              style={styles.input}
              placeholder="NOME DO TITULAR"
              placeholderTextColor="#C6C6C6"
              value={titular}
              onChangeText={setTitular}
              autoCapitalize="characters"
            />

            <View style={styles.linhaCartao}>
              <TextInput
                style={[styles.input, styles.inputMetade]}
                placeholder="VALIDADE"
                placeholderTextColor="#C6C6C6"
                value={validade}
                onChangeText={formatarValidade}
                keyboardType="numeric"
                maxLength={5}
              />

              <TextInput
                style={[styles.input, styles.inputMetade]}
                placeholder="CVV"
                placeholderTextColor="#C6C6C6"
                value={cvv}
                onChangeText={(texto) =>
                  setCvv(texto.replace(/\D/g, '').slice(0, 4))
                }
                keyboardType="numeric"
                secureTextEntry
                maxLength={4}
              />
            </View>
          </View>
        )}

        {/* PIX */}
        <LinhaPagamento
          tipo="pix"
          titulo="PIX"
          icone="qr-code-outline"
        />

        {metodo === 'pix' && (
          <View style={styles.areaPix}>
            <Ionicons
              name="qr-code-outline"
              size={145}
              color="#111111"
            />

            <Text style={styles.textoPix}>
              O QR Code de pagamento será disponibilizado
              após a integração com o serviço de PIX.
            </Text>
          </View>
        )}

        {/* BOLETO */}
        <LinhaPagamento
          tipo="boleto"
          titulo="BOLETO BANCÁRIO"
          icone="document-text-outline"
        />

        {metodo === 'boleto' && (
          <View style={styles.areaBoleto}>
            <Ionicons
              name="document-text-outline"
              size={35}
              color="#111111"
            />

            <Text style={styles.textoBoleto}>
              O boleto bancário foi gerado e o download foi iniciado.
            </Text>
          </View>
        )}

        {/* PARCELAMENTO */}
        <TouchableOpacity
          style={styles.seletorParcelas}
          onPress={() => setMostrarParcelas(!mostrarParcelas)}
          activeOpacity={0.7}
        >
          <Text style={styles.textoParcelas}>
            {parcelamento}x de {formatarPreco(total / parcelamento)} sem juros
          </Text>

          <Ionicons
            name={mostrarParcelas ? 'chevron-up' : 'chevron-down'}
            size={21}
            color="#111111"
          />
        </TouchableOpacity>

        {mostrarParcelas && (
          <View style={styles.listaParcelas}>
            {[1, 2, 3, 4, 5, 6].map((parcela) => (
              <TouchableOpacity
                key={parcela}
                style={styles.itemParcela}
                onPress={() => {
                  setParcelamento(parcela);
                  setMostrarParcelas(false);
                }}
              >
                <Text style={styles.textoItemParcela}>
                  {parcela}x de {formatarPreco(total / parcela)} sem juros
                </Text>

                {parcelamento === parcela && (
                  <Ionicons
                    name="checkmark"
                    size={17}
                    color="#111111"
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* SEGURANÇA */}
        <View style={styles.seguranca}>
          <Ionicons
            name="lock-closed-outline"
            size={13}
            color="#BDBDBD"
          />

          <Text style={styles.textoSeguranca}>
            Ambiente Seguro. Seus Dados Estão Protegidos.
          </Text>
        </View>

        {/* FINALIZAR */}
        <TouchableOpacity
          style={[
            styles.botaoFinalizar,
            (carregando || itens.length === 0 || finalizando) &&
              styles.botaoDesativado,
          ]}
          onPress={finalizarPagamento}
          disabled={carregando || itens.length === 0 || finalizando}
          activeOpacity={0.8}
        >
          <Text style={styles.textoFinalizar}>
            PAGAMENTO FINALIZADO
          </Text>
        </TouchableOpacity>

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
    paddingHorizontal: 24,
    paddingBottom: 35,
  },

  cabecalho: {
    height: 110,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  espaco: {
    width: 28,
  },

  logoContainer: {
    alignItems: 'center',
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
  },

  divisoriaTopo: {
    height: 2,
    backgroundColor: '#BDBDBD',
    marginHorizontal: -13,
  },

  voltar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 9,
    marginBottom: 24,
    gap: 5,
  },

  textoVoltar: {
    fontSize: 9,
    color: '#777777',
  },

  tituloArea: {
    marginBottom: 13,
  },

  titulo: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111111',
  },

  subtitulo: {
    fontSize: 9,
    color: '#777777',
    marginTop: 3,
  },

  cardProdutos: {
    borderWidth: 1,
    borderColor: '#D2D2D2',
    borderRadius: 3,
    padding: 11,
    marginBottom: 18,
    minHeight: 85,
    justifyContent: 'center',
  },

  sacolaVazia: {
    textAlign: 'center',
    fontSize: 12,
    color: '#777777',
    padding: 20,
  },

  produto: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 11,
  },

  imagemProduto: {
    width: 87,
    height: 90,
    backgroundColor: '#EEEEEE',
  },

  imagemSemFoto: {
    width: 87,
    height: 90,
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center',
  },

  infoProduto: {
    flex: 1,
    marginLeft: 8,
    paddingTop: 5,
  },

  nomeProduto: {
    fontSize: 12,
    color: '#111111',
    lineHeight: 16,
  },

  detalheProduto: {
    fontSize: 11,
    color: '#777777',
    marginTop: 2,
  },

  precoProduto: {
    fontSize: 11,
    color: '#111111',
    marginTop: 5,
    fontWeight: '600',
  },

  resumo: {
    backgroundColor: '#F4F4F4',
    borderRadius: 3,
    paddingHorizontal: 9,
    paddingTop: 9,
    marginBottom: 15,
  },

  linhaResumo: {
    height: 27,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  textoResumo: {
    fontSize: 11,
    color: '#777777',
  },

  linhaTotal: {
    height: 29,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  textoTotal: {
    fontSize: 11,
    color: '#111111',
    fontWeight: '600',
  },

  tituloMetodo: {
    fontSize: 9,
    color: '#777777',
    marginBottom: 8,
  },

  opcaoPagamento: {
    height: 31,
    borderWidth: 1,
    borderColor: '#D2D2D2',
    borderRadius: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 8,
  },

  opcaoSelecionada: {
    borderColor: '#111111',
  },

  ladoOpcao: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  radio: {
    width: 13,
    height: 13,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  radioInterno: {
    width: 7,
    height: 7,
    borderRadius: 10,
    backgroundColor: '#111111',
  },

  textoOpcao: {
    fontSize: 9,
    color: '#111111',
  },

  camposCartao: {
    marginBottom: 7,
  },

  input: {
    height: 31,
    borderWidth: 1,
    borderColor: '#D2D2D2',
    borderRadius: 3,
    paddingHorizontal: 13,
    fontSize: 9,
    color: '#111111',
    marginBottom: 19,
    backgroundColor: '#FFFFFF',
  },

  linhaCartao: {
    flexDirection: 'row',
    gap: 7,
  },

  inputMetade: {
    flex: 1,
    marginBottom: 10,
  },

  areaPix: {
    minHeight: 183,
    borderWidth: 1,
    borderColor: '#D2D2D2',
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    marginBottom: 8,
  },

  textoPix: {
    fontSize: 10,
    color: '#777777',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 15,
  },

  areaBoleto: {
    borderWidth: 1,
    borderColor: '#D2D2D2',
    borderRadius: 3,
    padding: 16,
    alignItems: 'center',
    marginBottom: 8,
  },

  textoBoleto: {
    fontSize: 10,
    color: '#777777',
    lineHeight: 16,
    textAlign: 'center',
    marginTop: 9,
  },

  seletorParcelas: {
    height: 31,
    borderWidth: 1,
    borderColor: '#D2D2D2',
    borderRadius: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 11,
  },

  textoParcelas: {
    fontSize: 11,
    color: '#111111',
  },

  listaParcelas: {
    borderWidth: 1,
    borderColor: '#D2D2D2',
    borderRadius: 3,
    marginTop: 3,
    marginBottom: 5,
  },

  itemParcela: {
    minHeight: 34,
    paddingHorizontal: 11,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },

  textoItemParcela: {
    fontSize: 11,
    color: '#111111',
  },

  seguranca: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
    gap: 5,
  },

  textoSeguranca: {
    fontSize: 9,
    color: '#B8B8B8',
  },

  botaoFinalizar: {
    height: 34,
    backgroundColor: '#000000',
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 1,
  },

  botaoDesativado: {
    opacity: 0.4,
  },

  textoFinalizar: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '400',
  },
});
