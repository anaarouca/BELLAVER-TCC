
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  type ImageSourcePropType,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type ItemSacola = {
  id: string;
  nome: string;
  marca: string;
  preco: number;
  precoAntigo?: number;
  tamanho: string;
  imagem: ImageSourcePropType | string;
  quantidade: number;
};

const produtosIniciais: ItemSacola[] = [
  {
    id: "1",
    nome: "Colete Alfaiataria Risca de Giz Hudson",
    marca: "Bellaver",
    preco: 297,
    precoAntigo: 389,
    tamanho: "36",
    imagem: require('../../assets/Img/ColeteAlfaiatariaRisca.png'),
    quantidade: 1,
  },
  {
    id: "2",
    nome: "Conjunto Alfaiataria Off-White",
    marca: "Bellaver",
    preco: 697,
    precoAntigo: 899,
    tamanho: "40",
    imagem: require('../../assets/Img/ConjuntoAlfaiatariaOff.png'),
    quantidade: 1,
  },
];

const formatarPreco = (valor: number) =>
  valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

export default function Sacola() {
  const [itens, setItens] = useState<ItemSacola[]>(produtosIniciais);
  const [favoritos, setFavoritos] = useState<ItemSacola[]>([]);
  const [aba, setAba] = useState<"sacola" | "favoritos">("sacola");
  const [cupom, setCupom] = useState("");
  const [desconto, setDesconto] = useState(0);
  const [cupomAplicado, setCupomAplicado] = useState("");

  const subtotal = itens.reduce(
    (total, item) => total + item.preco * item.quantidade,
    0
  );

  const valorDesconto = subtotal * (desconto / 100);
  const total = subtotal - valorDesconto;

  function alterarQuantidade(id: string, variacao: number) {
    setItens((lista) =>
      lista.map((item) =>
        item.id === id
          ? {
            ...item,
            quantidade: Math.max(
              1,
              item.quantidade + variacao
            ),
          }
          : item
      )
    );
  }

  function removerItem(id: string) {
    setItens((lista) => lista.filter((item) => item.id !== id));
  }

  function removerFavorito(id: string) {
    setFavoritos((lista) => lista.filter((item) => item.id !== id));
  }

  function aplicarCupom() {
    const codigo = cupom.trim().toUpperCase();

    if (codigo === "BELLAVER10") {
      setDesconto(10);
      setCupomAplicado(codigo);
      Alert.alert("Cupom aplicado", "Você recebeu 10% de desconto.");
    } else {
      setDesconto(0);
      setCupomAplicado("");
      Alert.alert(
        "Cupom inválido",
        "Verifique o código e tente novamente."
      );
    }
  }

  function alternarFavorito(item: ItemSacola) {
    const jaExiste = favoritos.some(
      (favorito) => favorito.id === item.id
    );

    if (jaExiste) {
      removerFavorito(item.id);
    } else {
      setFavoritos((lista) => [...lista, item]);
    }
  }

  function finalizarCompra() {
    if (itens.length === 0) {
      Alert.alert("Sacola vazia", "Adicione produtos antes de continuar.");
      return;
    }

    Alert.alert(
      "Finalizar compra",
      `Total do pedido: ${formatarPreco(total)}\n\nA próxima etapa será a integração com o checkout do Bellaver.`
    );
  }

  const listaExibida = aba === "sacola" ? itens : favoritos;

  return (
    <SafeAreaView style={styles.tela}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.aplicativo}>
        {/* Cabeçalho */}
        <View style={styles.cabecalho}>
          <TouchableOpacity
            style={styles.menu}
            onPress={() =>
              Alert.alert("Bellaver", "Menu do aplicativo")
            }
          >
            <Ionicons name="menu-outline" size={26} color="#111" />
          </TouchableOpacity>

          <View style={styles.logo}>
            <Text style={styles.nomeLogo}>BELLAVER</Text>
            <Text style={styles.anoLogo}>EST. 1972</Text>
          </View>
        </View>

        <View style={styles.divisorTopo} />

        {/* Abas */}
        <View style={styles.abas}>
          <TouchableOpacity
            style={[
              styles.aba,
              aba === "sacola" && styles.abaAtiva,
            ]}
            onPress={() => setAba("sacola")}
          >
            <Text
              style={[
                styles.textoAba,
                aba === "sacola" && styles.textoAbaAtiva,
              ]}
            >
              SACOLA ({itens.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.aba,
              aba === "favoritos" && styles.abaAtiva,
            ]}
            onPress={() => setAba("favoritos")}
          >
            <Text
              style={[
                styles.textoAba,
                aba === "favoritos" && styles.textoAbaAtiva,
              ]}
            >
              FAVORITOS ({favoritos.length})
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.conteudo}
          showsVerticalScrollIndicator={false}
        >
          {/* Produtos */}
          {listaExibida.length === 0 ? (
            <View style={styles.vazio}>
              <Ionicons
                name={
                  aba === "sacola"
                    ? "bag-outline"
                    : "heart-outline"
                }
                size={36}
                color="#777"
              />
              <Text style={styles.textoVazio}>
                {aba === "sacola"
                  ? "Sua sacola está vazia."
                  : "Você ainda não tem favoritos."}
              </Text>
            </View>
          ) : (
            listaExibida.map((item) => (
              <View style={styles.produto} key={item.id}>
                <Image
                  source={
                    typeof item.imagem === 'string'
                      ? { uri: item.imagem }
                      : item.imagem
                  }
                  style={styles.imagemProduto}
                  resizeMode="cover"
                />

                <View style={styles.detalhes}>
                  <Text style={styles.nomeProduto}>
                    {item.nome}
                  </Text>

                  {item.precoAntigo !== undefined && (
                    <Text style={styles.precoAntigo}>
                      {formatarPreco(item.precoAntigo)}
                    </Text>
                  )}

                  <Text style={styles.precoAtual}>
                    {formatarPreco(item.preco)}
                  </Text>

                  {aba === "sacola" ? (
                    <View style={styles.informacoes}>
                      <View style={styles.quantidade}>
                        <TouchableOpacity
                          style={styles.botaoQuantidade}
                          onPress={() =>
                            alterarQuantidade(item.id, -1)
                          }
                        >
                          <Text style={styles.textoQuantidade}>-</Text>
                        </TouchableOpacity>

                        <Text style={styles.numeroQuantidade}>
                          {item.quantidade}
                        </Text>

                        <TouchableOpacity
                          style={styles.botaoQuantidade}
                          onPress={() =>
                            alterarQuantidade(item.id, 1)
                          }
                        >
                          <Text style={styles.textoQuantidade}>+</Text>
                        </TouchableOpacity>
                      </View>

                      <Text style={styles.tamanho}>
                        Tamanho - {item.tamanho}
                      </Text>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.adicionarFavorito}
                      onPress={() => {
                        setItens((lista) => [...lista, item]);
                        removerFavorito(item.id);
                        setAba("sacola");
                      }}
                    >
                      <Text style={styles.textoAdicionar}>
                        ADICIONAR À SACOLA
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>

                <TouchableOpacity
                  style={styles.excluir}
                  onPress={() =>
                    aba === "sacola"
                      ? removerItem(item.id)
                      : removerFavorito(item.id)
                  }
                >
                  <Ionicons
                    name="trash-outline"
                    size={18}
                    color="#999999"
                  />
                </TouchableOpacity>

                {aba === "sacola" && (
                  <TouchableOpacity
                    style={styles.coracao}
                    onPress={() => alternarFavorito(item)}
                  >
                    <Ionicons
                      name={
                        favoritos.some((f) => f.id === item.id)
                          ? "heart"
                          : "heart-outline"
                      }
                      size={17}
                      color={
                        favoritos.some((f) => f.id === item.id)
                          ? "#A00000"
                          : "#888888"
                      }
                    />
                  </TouchableOpacity>
                )}
              </View>
            ))
          )}

          {/* Resumo da compra */}
          {aba === "sacola" && itens.length > 0 && (
            <>
              <View style={styles.resumo}>
                <Text style={styles.tituloResumo}>RESUMO</Text>

                <View style={styles.caixaResumo}>
                  <View style={styles.linhaResumo}>
                    <Text style={styles.rotuloResumo}>Subtotal</Text>
                    <Text style={styles.valorResumo}>
                      {formatarPreco(subtotal)}
                    </Text>
                  </View>

                  {desconto > 0 && (
                    <View style={styles.linhaResumo}>
                      <Text style={styles.rotuloResumo}>
                        Desconto ({desconto}%)
                      </Text>
                      <Text style={styles.valorResumo}>
                        - {formatarPreco(valorDesconto)}
                      </Text>
                    </View>
                  )}

                  <View style={styles.linhaResumo}>
                    <Text style={styles.rotuloResumo}>Frete</Text>
                    <Text style={styles.valorResumo}>Grátis</Text>
                  </View>

                  <View style={styles.divisor} />

                  <View style={styles.linhaResumo}>
                    <Text style={styles.totalRotulo}>Total</Text>
                    <Text style={styles.totalValor}>
                      {formatarPreco(total)}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Cupom */}
              <View style={styles.areaCupom}>
                <TextInput
                  style={styles.inputCupom}
                  placeholder="CUPOM DE DESCONTO"
                  placeholderTextColor="#AAAAAA"
                  value={cupom}
                  onChangeText={setCupom}
                  autoCapitalize="characters"
                />

                <TouchableOpacity
                  style={styles.botaoCupom}
                  onPress={aplicarCupom}
                >
                  <Text style={styles.textoCupom}>APLICAR</Text>
                </TouchableOpacity>
              </View>

              {cupomAplicado !== "" && (
                <Text style={styles.cupomSucesso}>
                  Cupom {cupomAplicado} aplicado!
                </Text>
              )}

              {/* Finalizar */}
              <TouchableOpacity
                style={styles.botaoFinalizar}
                onPress={finalizarCompra}
              >
                <Text style={styles.textoFinalizar}>
                  FINALIZAR COMPRA
                </Text>
              </TouchableOpacity>
            </>
          )}

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

  aplicativo: {
    flex: 1,
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#222222",
  },

  cabecalho: {
    height: 114,
    marginHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  menu: {
    position: "absolute",
    right: 3,
    top: 35,
    width: 27,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },

  logo: {
    alignItems: "center",
    marginTop: 17,
  },

  nomeLogo: {
    fontSize: 29,
    fontWeight: "300",
    letterSpacing: 6,
    color: "#080808",
  },

  anoLogo: {
    fontSize: 11,
    marginTop: 5,
    color: "#111111",
  },

  divisorTopo: {
    height: 1,
    backgroundColor: "#BBBBBB",
    marginHorizontal: 16,
  },

  abas: {
    height: 32,
    flexDirection: "row",
    marginHorizontal: 19,
    marginTop: 30,
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },

  aba: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },

  abaAtiva: {
    borderBottomColor: "#777777",
  },

  textoAba: {
    fontSize: 9,
    color: "#BBBBBB",
    fontWeight: "500",
  },

  textoAbaAtiva: {
    color: "#111111",
    fontWeight: "700",
  },

  conteudo: {
    flex: 1,
    paddingHorizontal: 27,
  },

  produto: {
    flexDirection: "row",
    paddingTop: 25,
    paddingBottom: 26,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
    position: "relative",
    minHeight: 170,
  },

  imagemProduto: {
    width: "33%",
    height: 118,
    backgroundColor: "#F1F1F1",
  },

  detalhes: {
    flex: 1,
    paddingLeft: 12,
    paddingRight: 2,
    paddingTop: 4,
  },

  nomeProduto: {
    fontSize: 11,
    lineHeight: 15,
    color: "#111111",
  },

  precoAntigo: {
    fontSize: 9,
    color: "#AAAAAA",
    textDecorationLine: "line-through",
    marginTop: 4,
  },

  precoAtual: {
    fontSize: 11,
    color: "#111111",
    marginTop: 2,
  },

  informacoes: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 22,
    flexWrap: "wrap",
  },

  quantidade: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  botaoQuantidade: {
    width: 15,
    height: 17,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    alignItems: "center",
    justifyContent: "center",
  },

  textoQuantidade: {
    fontSize: 10,
    color: "#111111",
  },

  numeroQuantidade: {
    fontSize: 10,
    color: "#111111",
  },

  tamanho: {
    fontSize: 9,
    color: "#888888",
    marginLeft: 15,
  },

  excluir: {
    position: "absolute",
    right: 17,
    bottom: 24,
    padding: 2,
  },

  coracao: {
    position: "absolute",
    right: 2,
    top: 27,
  },

  resumo: {
    marginTop: 24,
  },

  tituloResumo: {
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 6,
    marginBottom: 17,
    color: "#111111",
  },

  caixaResumo: {
    backgroundColor: "#F5F5F5",
    borderRadius: 2,
    paddingHorizontal: 9,
    paddingVertical: 9,
  },

  linhaResumo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 27,
  },

  rotuloResumo: {
    fontSize: 11,
    color: "#777777",
  },

  valorResumo: {
    fontSize: 11,
    color: "#666666",
  },

  divisor: {
    height: 1,
    backgroundColor: "#EAEAEA",
    marginTop: 3,
    marginBottom: 3,
  },

  totalRotulo: {
    fontSize: 11,
    color: "#111111",
  },

  totalValor: {
    fontSize: 11,
    color: "#111111",
    fontWeight: "500",
  },

  areaCupom: {
    flexDirection: "row",
    height: 29,
    marginTop: 28,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 3,
    overflow: "hidden",
  },

  inputCupom: {
    flex: 1,
    paddingHorizontal: 10,
    fontSize: 9,
    color: "#111111",
  },

  botaoCupom: {
    width: 85,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
  },

  textoCupom: {
    fontSize: 9,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  cupomSucesso: {
    fontSize: 10,
    color: "#333333",
    marginTop: 7,
  },

  botaoFinalizar: {
    height: 30,
    backgroundColor: "#000000",
    borderRadius: 3,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 28,
  },

  textoFinalizar: {
    fontSize: 10,
    color: "#FFFFFF",
    fontWeight: "500",
  },

  vazio: {
    minHeight: 180,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },

  textoVazio: {
    fontSize: 13,
    color: "#777777",
  },

  adicionarFavorito: {
    marginTop: 15,
    paddingVertical: 8,
    paddingHorizontal: 5,
    backgroundColor: "#000000",
    alignSelf: "flex-start",
  },

  textoAdicionar: {
    fontSize: 8,
    color: "#FFFFFF",
  },

  espacoFinal: {
    height: 40,
  },
});
