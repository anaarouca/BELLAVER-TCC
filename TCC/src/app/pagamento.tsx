
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function Pagamento() {
  const router = useRouter();

  const [metodo, setMetodo] = useState("Cartão de crédito");
  const [parcelas, setParcelas] = useState("1x de R$ 994,00 sem juros");
  const [mostrarParcelas, setMostrarParcelas] = useState(false);

  const subtotal = 994;
  const frete = 0;

  const opcoesPagamento = [
    "Cartão de crédito",
    "PIX",
    "Boleto bancário",
  ];

  const opcoesParcelas = [
    "1x de R$ 994,00 sem juros",
    "2x de R$ 497,00 sem juros",
    "3x de R$ 331,33 sem juros",
    "4x de R$ 248,50 sem juros",
    "5x de R$ 198,80 sem juros",
    "6x de R$ 165,67 sem juros",
  ];

  function finalizarPagamento() {
    Alert.alert(
      "Pagamento demonstrativo",
      `Forma escolhida: ${metodo}\nTotal: R$ ${(subtotal + frete).toLocaleString(
        "pt-BR",
        { minimumFractionDigits: 2 }
      )}\n\nEsta tela ainda não processa pagamentos reais.`
    );
  }

  return (
    <SafeAreaView style={styles.tela}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
      />

      <View style={styles.container}>
        {/* CABEÇALHO */}
        <View style={styles.cabecalho}>
          <TouchableOpacity
            style={styles.menu}
            onPress={() =>
              Alert.alert("Bellaver", "Menu do aplicativo")
            }
          >
            <Ionicons
              name="menu-outline"
              size={26}
              color="#111111"
            />
          </TouchableOpacity>

          <Text style={styles.logo}>BELLAVER</Text>
          <Text style={styles.ano}>EST. 1972</Text>
        </View>

        <ScrollView
          style={styles.conteudo}
          showsVerticalScrollIndicator={false}
        >
          {/* VOLTAR */}
          <TouchableOpacity
            style={styles.voltar}
            onPress={() => router.back()}
          >
            <Ionicons
              name="arrow-back-outline"
              size={13}
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

          {/* PRODUTOS */}
          <View style={styles.caixaProdutos}>
            <View style={styles.produto}>
              <View style={styles.imagemProduto}>
                <Ionicons
                  name="shirt-outline"
                  size={32}
                  color="#777777"
                />
              </View>

              <View style={styles.detalhesProduto}>
                <Text style={styles.nomeProduto}>
                  Conjunto Alfaiataria Off-White
                </Text>
                <Text style={styles.infoProduto}>
                  Tamanho - 36
                </Text>
                <Text style={styles.infoProduto}>Qtd: 1</Text>
              </View>
            </View>

            <View style={styles.produto}>
              <View style={styles.imagemProduto}>
                <Ionicons
                  name="shirt-outline"
                  size={32}
                  color="#777777"
                />
              </View>

              <View style={styles.detalhesProduto}>
                <Text style={styles.nomeProduto}>
                  Conjunto Alfaiataria Off-White
                </Text>
                <Text style={styles.infoProduto}>
                  Tamanho - 40
                </Text>
                <Text style={styles.infoProduto}>Qtd: 1</Text>
              </View>
            </View>
          </View>

          {/* RESUMO */}
          <View style={styles.resumo}>
            <View style={styles.linhaResumo}>
              <Text style={styles.textoResumo}>Subtotal</Text>
              <Text style={styles.textoResumo}>R$ 994,00</Text>
            </View>

            <View style={styles.linhaResumo}>
              <Text style={styles.textoResumo}>Frete</Text>
              <Text style={styles.textoResumo}>Grátis</Text>
            </View>

            <View style={styles.divisor} />

            <View style={styles.linhaResumo}>
              <Text style={styles.total}>Total</Text>
              <Text style={styles.total}>R$ 994,00</Text>
            </View>
          </View>

          {/* FORMAS DE PAGAMENTO */}
          <Text style={styles.rotuloMetodo}>
            MÉTODO DE PAGAMENTO
          </Text>

          {opcoesPagamento.map((opcao) => (
            <TouchableOpacity
              key={opcao}
              style={styles.opcaoPagamento}
              onPress={() => setMetodo(opcao)}
            >
              <View style={styles.ladoEsquerdo}>
                <View style={styles.radio}>
                  {metodo === opcao && (
                    <View style={styles.radioSelecionado} />
                  )}
                </View>

                <Text style={styles.textoOpcao}>
                  {opcao.toUpperCase()}
                </Text>
              </View>

              {opcao === "Cartão de crédito" && (
                <Ionicons
                  name="card-outline"
                  size={21}
                  color="#111111"
                />
              )}

              {opcao === "PIX" && (
                <Ionicons
                  name="qr-code-outline"
                  size={20}
                  color="#111111"
                />
              )}

              {opcao === "Boleto bancário" && (
                <Ionicons
                  name="barcode-outline"
                  size={22}
                  color="#111111"
                />
              )}
            </TouchableOpacity>
          ))}

          {/* PARCELAS */}
          {metodo === "Cartão de crédito" && (
            <View>
              <TouchableOpacity
                style={styles.seletorParcelas}
                onPress={() =>
                  setMostrarParcelas(!mostrarParcelas)
                }
              >
                <Text style={styles.textoParcelas}>
                  {parcelas}
                </Text>

                <Ionicons
                  name={
                    mostrarParcelas
                      ? "chevron-up"
                      : "chevron-down"
                  }
                  size={17}
                  color="#111111"
                />
              </TouchableOpacity>

              {mostrarParcelas && (
                <View style={styles.listaParcelas}>
                  {opcoesParcelas.map((opcao) => (
                    <TouchableOpacity
                      key={opcao}
                      style={styles.itemParcela}
                      onPress={() => {
                        setParcelas(opcao);
                        setMostrarParcelas(false);
                      }}
                    >
                      <Text style={styles.textoParcelas}>
                        {opcao}
                      </Text>

                      {parcelas === opcao && (
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
            </View>
          )}

          {/* AVISO DE SEGURANÇA */}
          <View style={styles.seguranca}>
            <Ionicons
              name="lock-closed-outline"
              size={13}
              color="#BBBBBB"
            />
            <Text style={styles.textoSeguranca}>
              Ambiente Seguro. Seus Dados Estão Protegidos.
            </Text>
          </View>

          {/* FINALIZAR */}
          <TouchableOpacity
            style={styles.botaoFinalizar}
            onPress={finalizarPagamento}
          >
            <Text style={styles.textoFinalizar}>
              FINALIZAR PAGAMENTO
            </Text>
          </TouchableOpacity>

          <View style={styles.espacoFinal} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  container: {
    flex: 1,
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#222222",
  },

  cabecalho: {
    height: 111,
    marginHorizontal: 13,
    borderBottomWidth: 1,
    borderBottomColor: "#AAAAAA",
    alignItems: "center",
    justifyContent: "center",
  },

  menu: {
    position: "absolute",
    right: 2,
    top: 28,
  },

  logo: {
    fontSize: 29,
    fontWeight: "300",
    letterSpacing: 6,
    color: "#080808",
    marginTop: 10,
  },

  ano: {
    fontSize: 11,
    color: "#111111",
    marginTop: 5,
  },

  conteudo: {
    flex: 1,
    paddingHorizontal: 23,
  },

  voltar: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 36,
    gap: 4,
  },

  textoVoltar: {
    fontSize: 9,
    color: "#777777",
  },

  tituloArea: {
    marginBottom: 5,
  },

  titulo: {
    fontSize: 12,
    fontWeight: "700",
    color: "#111111",
  },

  subtitulo: {
    fontSize: 9,
    color: "#777777",
    marginTop: 4,
  },

  caixaProdutos: {
    borderWidth: 1,
    borderColor: "#D5D5D5",
    borderRadius: 3,
    padding: 12,
  },

  produto: {
    flexDirection: "row",
    minHeight: 101,
    marginBottom: 10,
  },

  imagemProduto: {
    width: 87,
    height: 91,
    backgroundColor: "#F1F1F1",
    alignItems: "center",
    justifyContent: "center",
  },

  detalhesProduto: {
    flex: 1,
    paddingLeft: 7,
    paddingTop: 5,
  },

  nomeProduto: {
    fontSize: 11,
    color: "#111111",
    lineHeight: 15,
  },

  infoProduto: {
    fontSize: 11,
    color: "#888888",
    marginTop: 2,
  },

  resumo: {
    backgroundColor: "#F4F4F4",
    borderRadius: 3,
    paddingHorizontal: 9,
    paddingVertical: 7,
    marginTop: 19,
  },

  linhaResumo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 26,
  },

  textoResumo: {
    fontSize: 11,
    color: "#777777",
  },

  divisor: {
    height: 1,
    backgroundColor: "#EAEAEA",
  },

  total: {
    fontSize: 11,
    color: "#111111",
    fontWeight: "600",
  },

  rotuloMetodo: {
    fontSize: 9,
    color: "#777777",
    marginTop: 16,
    marginBottom: 8,
  },

  opcaoPagamento: {
    height: 31,
    borderWidth: 1,
    borderColor: "#D5D5D5",
    borderRadius: 3,
    marginBottom: 8,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  ladoEsquerdo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  radio: {
    width: 12,
    height: 12,
    borderWidth: 1,
    borderColor: "#111111",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },

  radioSelecionado: {
    width: 6,
    height: 6,
    backgroundColor: "#111111",
    borderRadius: 3,
  },

  textoOpcao: {
    fontSize: 9,
    color: "#111111",
  },

  seletorParcelas: {
    height: 31,
    borderWidth: 1,
    borderColor: "#D5D5D5",
    borderRadius: 3,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  textoParcelas: {
    fontSize: 10,
    color: "#111111",
  },

  listaParcelas: {
    borderWidth: 1,
    borderColor: "#DDDDDD",
    marginTop: 3,
    paddingHorizontal: 10,
    backgroundColor: "#FFFFFF",
  },

  itemParcela: {
    minHeight: 35,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },

  seguranca: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    marginTop: 16,
    marginBottom: 24,
  },

  textoSeguranca: {
    fontSize: 9,
    color: "#AAAAAA",
  },

  botaoFinalizar: {
    height: 30,
    backgroundColor: "#000000",
    borderRadius: 3,
    alignItems: "center",
    justifyContent: "center",
  },

  textoFinalizar: {
    fontSize: 10,
    color: "#FFFFFF",
    fontWeight: "500",
  },

  espacoFinal: {
    height: 30,
  },
});
