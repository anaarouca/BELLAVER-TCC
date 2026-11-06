
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  Platform,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import QRCode from "react-native-qrcode-svg";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

export default function Pagamento() {
  const router = useRouter();

  const [metodo, setMetodo] = useState("");
  const [numeroCartao, setNumeroCartao] = useState("");
  const [titular, setTitular] = useState("");
  const [validade, setValidade] = useState("");
  const [cvv, setCvv] = useState("");

  const [parcelas, setParcelas] = useState(
    "1x de R$ 994,00 sem juros"
  );

  const [mostrarParcelas, setMostrarParcelas] = useState(false);
  const [gerandoBoleto, setGerandoBoleto] = useState(false);

  const valorTotal = 994;

  const produtosPagamento = [
    {
      nome: "Colete Alfaiataria Risca de Giz Hudson",
      tamanho: "Tamanho - 36",
      qtd: "Qtd: 1",
      imagem: require("../../assets/Img/ConjuntoAlfaiatariaOff.png"),
    },
    {
      nome: "Conjunto Alfaiataria Off-White",
      tamanho: "Tamanho - 40",
      qtd: "Qtd: 1",
      imagem: require("../../assets/Img/ConjuntoSocialPreto.png"),
    },
  ];

  const opcoesParcelas = [
    "1x de R$ 994,00 sem juros",
    "2x de R$ 497,00 sem juros",
    "3x de R$ 331,33 sem juros",
    "4x de R$ 248,50 sem juros",
    "5x de R$ 198,80 sem juros",
    "6x de R$ 165,67 sem juros",
  ];

  // GERAR BOLETO EM PDF
  async function gerarBoleto() {
    if (gerandoBoleto) return;

    setMetodo("boleto");
    setGerandoBoleto(true);

    const numeroBoleto = "23793.38128 60000.000012 34000.000000 1";

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 35px;
            color: #111;
          }

          .topo {
            text-align: center;
            border-bottom: 1px solid #222;
            padding-bottom: 20px;
          }

          .logo {
            font-size: 28px;
            letter-spacing: 8px;
          }

          .ano {
            font-size: 11px;
            margin-top: 8px;
          }

          h2 {
            font-size: 18px;
            margin-top: 35px;
          }

          .linha {
            border-bottom: 1px solid #ddd;
            padding: 13px 0;
            font-size: 13px;
          }

          .valor {
            font-size: 23px;
            font-weight: bold;
            margin-top: 25px;
          }

          .codigo {
            margin-top: 35px;
            padding: 20px;
            border: 1px solid #ddd;
            font-size: 17px;
            text-align: center;
            letter-spacing: 2px;
          }

          .aviso {
            margin-top: 35px;
            font-size: 11px;
            color: #777;
            line-height: 1.6;
          }

          .rodape {
            margin-top: 45px;
            text-align: center;
            font-size: 10px;
            color: #888;
          }
        </style>
      </head>

      <body>

        <div class="topo">
          <div class="logo">BELLAVER</div>
          <div class="ano">EST. 1972</div>
        </div>

        <h2>BOLETO BANCÁRIO</h2>

        <div class="linha">
          <strong>Beneficiário:</strong> Bellaver
        </div>

        <div class="linha">
          <strong>Pedido:</strong> BV-2026-001
        </div>

        <div class="linha">
          <strong>Data de emissão:</strong> 06/11/2026
        </div>

        <div class="linha">
          <strong>Vencimento:</strong> Documento demonstrativo
        </div>

        <div class="linha">
          <strong>Forma de pagamento:</strong> Boleto bancário
        </div>

        <div class="valor">
          Valor: R$ 994,00
        </div>

        <div class="codigo">
          ${numeroBoleto}
        </div>

        <div class="aviso">
          DOCUMENTO DE DEMONSTRAÇÃO DO PROJETO BELLAVER.
          Este documento não representa uma cobrança bancária real.
          Não realize pagamentos utilizando estas informações.
        </div>

        <div class="rodape">
          BELLAVER — ELEGÂNCIA E MODERNIDADE
        </div>

      </body>
      </html>
    `;

    try {
      if (Platform.OS === "web") {
        await Print.printAsync({ html });
      } else {
        const arquivo = await Print.printToFileAsync({
          html: html,
          base64: false,
        });

        const compartilhamentoDisponivel =
          await Sharing.isAvailableAsync();

        if (compartilhamentoDisponivel) {
          await Sharing.shareAsync(arquivo.uri, {
            mimeType: "application/pdf",
            dialogTitle: "Salvar boleto Bellaver",
            UTI: "com.adobe.pdf",
          });
        } else {
          Alert.alert(
            "Boleto gerado",
            "O documento foi gerado, mas o compartilhamento não está disponível neste dispositivo."
          );
        }
      }
    } catch (erro) {
      Alert.alert(
        "Erro",
        "Não foi possível gerar o boleto. Tente novamente."
      );
    } finally {
      setGerandoBoleto(false);
    }
  }

  // FINALIZAR PAGAMENTO
  function finalizarPagamento() {
    if (metodo === "") {
      Alert.alert(
        "Forma de pagamento",
        "Selecione uma forma de pagamento para continuar."
      );
      return;
    }

    if (metodo === "cartao") {
      if (
        numeroCartao.trim() === "" ||
        titular.trim() === "" ||
        validade.trim() === "" ||
        cvv.trim() === ""
      ) {
        Alert.alert(
          "Dados incompletos",
          "Preencha todos os campos do cartão."
        );
        return;
      }

      Alert.alert(
        "Bellaver",
        "Pagamento demonstrativo realizado com sucesso! Nenhuma cobrança foi feita."
      );

      return;
    }

    if (metodo === "pix") {
      Alert.alert(
        "Pagamento PIX",
        "Este QR Code é ilustrativo. Para pagamentos reais, será necessária uma integração com um serviço de pagamento."
      );

      return;
    }

    if (metodo === "boleto") {
      Alert.alert(
        "Bellaver",
        "O boleto demonstrativo foi disponibilizado para salvar ou compartilhar."
      );
    }
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
            onPress={() => router.push("/menu")}
          >
            <Ionicons
              name="menu-outline"
              size={25}
              color="#111111"
            />
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
            <Ionicons
              name="arrow-back-outline"
              size={13}
              color="#888888"
            />

            <Text style={styles.textoVoltar}>
              VOLTAR PARA A SACOLA
            </Text>
          </TouchableOpacity>

          {/* TÍTULO */}

          <Text style={styles.titulo}>PAGAMENTO</Text>

          <Text style={styles.subtitulo}>
            ESCOLHA A MELHOR FORMA PARA VOCÊ
          </Text>

          {/* PRODUTOS */}

          <View style={styles.caixaProdutos}>

            {produtosPagamento.map((produto, index) => (

              <View
                key={`${produto.nome}-${index}`}
                style={styles.produto}
              >

                <Image
                  source={produto.imagem}
                  style={styles.fotoProduto}
                  resizeMode="cover"
                />

                <View style={styles.detalhesProduto}>

                  <Text style={styles.nomeProduto}>
                    {produto.nome}
                  </Text>

                  <Text style={styles.infoProduto}>
                    {produto.tamanho}
                  </Text>

                  <Text style={styles.infoProduto}>
                    {produto.qtd}
                  </Text>

                </View>

              </View>

            ))}

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

          {/* MÉTODOS DE PAGAMENTO */}

          <Text style={styles.rotuloMetodo}>
            MÉTODO DE PAGAMENTO
          </Text>

          {/* CARTÃO DE CRÉDITO */}

          <TouchableOpacity
            style={[
              styles.opcao,
              metodo === "cartao" && styles.opcaoAtiva,
            ]}
            onPress={() => {
              setMetodo("cartao");
              setNumeroCartao("");
              setTitular("");
              setValidade("");
              setCvv("");
            }}
          >

            <View style={styles.ladoEsquerdo}>

              <View style={styles.radio}>
                {metodo === "cartao" && (
                  <View style={styles.radioDentro} />
                )}
              </View>

              <Text style={styles.textoOpcao}>
                CARTÃO DE CRÉDITO
              </Text>

            </View>

            <Ionicons
              name="card-outline"
              size={22}
              color="#111111"
            />

          </TouchableOpacity>

          {/* CAMPOS DO CARTÃO */}

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
            style={[
              styles.opcao,
              metodo === "pix" && styles.opcaoAtiva,
            ]}
            onPress={() => {
              setMetodo("pix");
              setMostrarParcelas(false);
            }}
          >

            <View style={styles.ladoEsquerdo}>

              <View style={styles.radio}>
                {metodo === "pix" && (
                  <View style={styles.radioDentro} />
                )}
              </View>

              <Text style={styles.textoOpcao}>PIX</Text>

            </View>

            <Ionicons
              name="qr-code"
              size={21}
              color="#111111"
            />

          </TouchableOpacity>

          {/* QR CODE */}

          {metodo === "pix" && (

            <View style={styles.containerQrPix}>

              <View style={styles.qrCodeBox}>

                <QRCode
                  value="BELLAVER - PAGAMENTO DEMONSTRATIVO - NAO E UM PIX REAL"
                  size={165}
                  color="#000000"
                  backgroundColor="#FFFFFF"
                />

              </View>

              <Text style={styles.avisoMetodo}>
                Escaneie o QR Code para visualizar as informações
                demonstrativas do pagamento.
              </Text>

              <Text style={styles.valorPix}>
                VALOR: R$ 994,00
              </Text>

            </View>

          )}

          {/* BOLETO */}

          <TouchableOpacity
            style={[
              styles.opcao,
              metodo === "boleto" && styles.opcaoAtiva,
            ]}
            onPress={gerarBoleto}
            disabled={gerandoBoleto}
          >

            <View style={styles.ladoEsquerdo}>

              <View style={styles.radio}>
                {metodo === "boleto" && (
                  <View style={styles.radioDentro} />
                )}
              </View>

              <Text style={styles.textoOpcao}>
                BOLETO BANCÁRIO
              </Text>

            </View>

            {gerandoBoleto ? (
              <Text style={styles.textoBaixando}>
                GERANDO...
              </Text>
            ) : (
              <Ionicons
                name="download-outline"
                size={22}
                color="#111111"
              />
            )}

          </TouchableOpacity>

          {metodo === "boleto" && (

            <View style={styles.avisoBoleto}>

              <Ionicons
                name="document-text-outline"
                size={18}
                color="#777777"
              />

              <Text style={styles.avisoMetodo}>
                Documento PDF demonstrativo. Selecione o boleto
                novamente para gerar outra cópia.
              </Text>

            </View>

          )}

          {/* PARCELAS */}

          {metodo === "cartao" && (

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

          {/* SEGURANÇA */}

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

// ESTILIZAÇÃO

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
  },

  fotoProduto: {
    width: 87,
    height: 91,
    backgroundColor: "#F0F0F0",
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

  opcaoAtiva: {
    borderColor: "#111111",
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

  containerQrPix: {
    marginTop: 8,
    marginBottom: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D5D5D5",
    borderRadius: 3,
    padding: 12,
  },

  qrCodeBox: {
    width: 185,
    height: 185,
    borderWidth: 1,
    borderColor: "#EEEEEE",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },

  avisoMetodo: {
    fontSize: 10,
    color: "#777777",
    lineHeight: 17,
    marginTop: 8,
    marginBottom: 5,
    paddingHorizontal: 3,
    textAlign: "center",
  },

  valorPix: {
    fontSize: 11,
    fontWeight: "600",
    color: "#111111",
    marginTop: 5,
  },

  avisoBoleto: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginBottom: 10,
  },

  textoBaixando: {
    fontSize: 9,
    color: "#777777",
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
