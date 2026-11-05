
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function Pagamento() {
  const router = useRouter();

  const [metodo, setMetodo] = useState("cartao");
  const [numeroCartao, setNumeroCartao] = useState("");
  const [titular, setTitular] = useState("");
  const [validade, setValidade] = useState("");
  const [cvv, setCvv] = useState("");
  const [parcelas, setParcelas] = useState("1x de R$ 1.894,00 sem juros");
  const [mostrarParcelas, setMostrarParcelas] = useState(false);

  const opcoesParcelas = [
    "1x de R$ 1.894,00 sem juros",
    "2x de R$ 947,00 sem juros",
    "3x de R$ 631,33 sem juros",
    "4x de R$ 473,50 sem juros",
    "5x de R$ 378,80 sem juros",
    "6x de R$ 315,67 sem juros",
  ];

  function finalizarPagamento() {
    if (metodo === "cartao") {
      if (
        numeroCartao.trim() === "" ||
        titular.trim() === "" ||
        validade.trim() === "" ||
        cvv.trim() === ""
      ) {
        Alert.alert(
          "Dados incompletos",
          "Preencha os campos do cartão para continuar."
        );
        return;
      }
    }

    Alert.alert(
      "Bellaver",
      "Esta é uma demonstração do pagamento. Nenhuma cobrança foi realizada."
    );
  }

  return (
    <SafeAreaView style={styles.tela}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.container}>
        {/* CABEÇALHO */}
        <View style={styles.cabecalho}>
          <TouchableOpacity
            style={styles.menu}
            onPress={() =>
              Alert.alert("Bellaver", "Menu do aplicativo")
            }
          >
            <Ionicons name="menu-outline" size={25} color="#111111" />
          </TouchableOpacity>

          <Text style={styles.logo}>BELLAVER</Text>
          <Text style={styles.ano}>EST. 1972</Text>
        </View>

        <ScrollView
          style={styles.conteudo}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* VOLTAR */}
          <TouchableOpacity
            style={styles.voltar}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back-outline" size={13} color="#888888" />
            <Text style={styles.textoVoltar}>VOLTAR PARA A SACOLA</Text>
          </TouchableOpacity>

          {/* TÍTULO */}
          <Text style={styles.titulo}>PAGAMENTO</Text>
          <Text style={styles.subtitulo}>
            ESCOLHA A MELHOR FORMA PARA VOCÊ
          </Text>

          {/* PRODUTOS */}
          <View style={styles.caixaProdutos}>
            <View style={styles.produto}>
              <View style={styles.fotoProduto}>
                <Ionicons name="shirt-outline" size={31} color="#888888" />
              </View>

              <View style={styles.detalhesProduto}>
                <Text style={styles.nomeProduto}>
                  Colete Alfaiataria Risca de Giz Hudson
                </Text>
                <Text style={styles.infoProduto}>Tamanho - 36</Text>
                <Text style={styles.infoProduto}>Qtd: 1</Text>
              </View>
            </View>

            <View style={styles.produto}>
              <View style={styles.fotoProduto}>
                <Ionicons name="shirt-outline" size={31} color="#888888" />
              </View>

              <View style={styles.detalhesProduto}>
                <Text style={styles.nomeProduto}>
                  Conjunto Alfaiataria Off-White
                </Text>
                <Text style={styles.infoProduto}>Tamanho - 40</Text>
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

            <View style={styles.linhaResumo}>
              <Text style={styles.total}>Total</Text>
              <Text style={styles.total}>R$ 994,00</Text>
            </View>
          </View>

          {/* MÉTODO */}
          <Text style={styles.rotuloMetodo}>MÉTODO DE PAGAMENTO</Text>

          {/* CARTÃO */}
          <TouchableOpacity
            style={styles.opcao}
            onPress={() => setMetodo("cartao")}
          >
            <View style={styles.ladoEsquerdo}>
              <View style={styles.radio}>
                {metodo === "cartao" && <View style={styles.radioDentro} />}
              </View>
              <Text style={styles.textoOpcao}>CARTÃO DE CRÉDITO</Text>
            </View>

            <Ionicons name="card-outline" size={22} color="#111111" />
          </TouchableOpacity>

          {metodo === "cartao" && (
            <View style={styles.camposCartao}>
              <TextInput
                style={styles.input}
                placeholder="NÚMERO DO CARTÃO"
                placeholderTextColor="#BBBBBB"
                value={numeroCartao}
                onChangeText={setNumeroCartao}
                keyboardType="numeric"
                maxLength={19}
              />

              <TextInput
                style={styles.input}
                placeholder="NOME DO TITULAR"
                placeholderTextColor="#BBBBBB"
                value={titular}
                onChangeText={setTitular}
                autoCapitalize="characters"
              />

              <View style={styles.linhaCampos}>
                <TextInput
                  style={[styles.input, styles.validade]}
                  placeholder="VALIDADE"
                  placeholderTextColor="#BBBBBB"
                  value={validade}
                  onChangeText={setValidade}
                  maxLength={5}
                />

                <TextInput
                  style={[styles.input, styles.cvv]}
                  placeholder="CVV"
                  placeholderTextColor="#BBBBBB"
                  value={cvv}
                  onChangeText={setCvv}
                  keyboardType="numeric"
                  maxLength={4}
                  secureTextEntry
                />
              </View>
            </View>
          )}

          {/* PIX */}
          <TouchableOpacity
            style={styles.opcao}
            onPress={() => setMetodo("pix")}
          >
            <View style={styles.ladoEsquerdo}>
              <View style={styles.radio}>
                {metodo === "pix" && <View style={styles.radioDentro} />}
              </View>
              <Text style={styles.textoOpcao}>PIX</Text>
            </View>

            <Ionicons name="qr-code" size={21} color="#111111" />
          </TouchableOpacity>

          {metodo === "pix" && (
            <Text style={styles.avisoMetodo}>
              O código PIX será disponibilizado após a confirmação do pedido.
            </Text>
          )}

          {/* BOLETO */}
          <TouchableOpacity
            style={styles.opcao}
            onPress={() => setMetodo("boleto")}
          >
            <View style={styles.ladoEsquerdo}>
              <View style={styles.radio}>
                {metodo === "boleto" && <View style={styles.radioDentro} />}
              </View>
              <Text style={styles.textoOpcao}>BOLETO BANCÁRIO</Text>
            </View>

            <Ionicons name="barcode-outline" size={22} color="#111111" />
          </TouchableOpacity>

          {metodo === "boleto" && (
            <Text style={styles.avisoMetodo}>
              Os dados do boleto serão apresentados após a confirmação do pedido.
            </Text>
          )}

          {/* PARCELAS */}
          {metodo === "cartao" && (
            <View>
              <TouchableOpacity
                style={styles.seletorParcelas}
                onPress={() => setMostrarParcelas(!mostrarParcelas)}
              >
                <Text style={styles.textoParcelas}>{parcelas}</Text>
                <Ionicons
                  name={mostrarParcelas ? "chevron-up" : "chevron-down"}
                  size={21}
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
                      <Text style={styles.textoParcelas}>{opcao}</Text>
                      {parcelas === opcao && (
                        <Ionicons name="checkmark" size={17} color="#111111" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          )}

          {/* SEGURANÇA */}
          <View style={styles.seguranca}>
            <Ionicons name="lock-closed-outline" size={13} color="#BBBBBB" />
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
    paddingHorizontal: 17,
  },
  voltar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 12,
    marginBottom: 15,
  },
  textoVoltar: {
    fontSize: 9,
    color: "#777777",
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
    marginBottom: 9,
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
    marginBottom: 0,
  },
  fotoProduto: {
    width: 87,
    height: 91,
    backgroundColor: "#F0F0F0",
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
    marginTop: 15,
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
  opcao: {
    minHeight: 31,
    borderWidth: 1,
    borderColor: "#D5D5D5",
    borderRadius: 3,
    marginBottom: 8,
    paddingHorizontal: 9,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ladoEsquerdo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  radio: {
    width: 16,
    height: 16,
    borderWidth: 1.5,
    borderColor: "#111111",
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  radioDentro: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#111111",
  },
  textoOpcao: {
    fontSize: 9,
    color: "#111111",
  },
  camposCartao: {
    gap: 20,
    marginBottom: 10,
  },
  input: {
    height: 30,
    borderWidth: 1,
    borderColor: "#D5D5D5",
    borderRadius: 3,
    paddingHorizontal: 12,
    fontSize: 9,
    color: "#111111",
  },
  linhaCampos: {
    flexDirection: "row",
    gap: 7,
  },
  validade: {
    flex: 1,
  },
  cvv: {
    flex: 1,
  },
  avisoMetodo: {
    fontSize: 11,
    color: "#777777",
    lineHeight: 17,
    marginBottom: 10,
    paddingHorizontal: 3,
  },
  seletorParcelas: {
    height: 31,
    borderWidth: 1,
    borderColor: "#D5D5D5",
    borderRadius: 3,
    paddingHorizontal: 9,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textoParcelas: {
    fontSize: 12,
    color: "#111111",
  },
  listaParcelas: {
    borderWidth: 1,
    borderColor: "#DDDDDD",
    marginTop: 3,
    paddingHorizontal: 10,
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
    marginTop: 17,
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
