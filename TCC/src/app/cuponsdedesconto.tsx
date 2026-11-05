
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Cupons() {
  const [aba, setAba] = useState("disponiveis");
  const [meusCupons, setMeusCupons] = useState<string[]>([]);

  const cupons = [
    {
      codigo: "BEMVINDO10",
      descricao: "10% OFF na primeira\ncompra",
      validade: "Válido até 27/11/2026",
    },
    {
      codigo: "FRETEGRATIS",
      descricao: "Frete grátis acima de R$199",
      validade: "Válido até 28/11/2026",
    },
    {
      codigo: "MAIS15",
      descricao: "15% OFF  acima de R$300",
      validade: "Válido até 27/11/2026",
    },
  ];

  function usarCupom(codigo: string) {
    if (meusCupons.includes(codigo)) {
      Alert.alert(
        "Cupom já adicionado",
        "Este cupom já está na sua lista de cupons."
      );
      return;
    }

    setMeusCupons([...meusCupons, codigo]);

    Alert.alert(
      "Cupom adicionado!",
      `O cupom ${codigo} foi adicionado aos seus cupons. Você poderá selecioná-lo na finalização da compra.`
    );
  }

  const listaCupons =
    aba === "disponiveis"
      ? cupons.filter((cupom) => !meusCupons.includes(cupom.codigo))
      : cupons.filter((cupom) => meusCupons.includes(cupom.codigo));

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
          {/* TÍTULO */}
          <Text style={styles.titulo}>
            Cupons e promoções
          </Text>

          {/* ABAS */}
          <View style={styles.abas}>
            <TouchableOpacity
              style={[
                styles.aba,
                aba === "disponiveis" && styles.abaAtiva,
              ]}
              onPress={() => setAba("disponiveis")}
            >
              <Text
                style={[
                  styles.textoAba,
                  aba === "disponiveis" && styles.textoAbaAtiva,
                ]}
              >
                Disponíveis
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.aba,
                aba === "meus" && styles.abaAtiva,
              ]}
              onPress={() => setAba("meus")}
            >
              <Text
                style={[
                  styles.textoAba,
                  aba === "meus" && styles.textoAbaAtiva,
                ]}
              >
                Meus cupons
                {meusCupons.length > 0
                  ? ` (${meusCupons.length})`
                  : ""}
              </Text>
            </TouchableOpacity>
          </View>

          {/* LISTA DE CUPONS */}
          <View style={styles.lista}>
            {listaCupons.length > 0 ? (
              listaCupons.map((cupom, index) => (
                <View
                  key={cupom.codigo}
                  style={[
                    styles.cartaoCupom,
                    index === listaCupons.length - 1 &&
                      styles.ultimoCupom,
                  ]}
                >
                  <View style={styles.informacoesCupom}>
                    <Text style={styles.codigo}>
                      {cupom.codigo}
                    </Text>

                    <Text style={styles.descricao}>
                      {cupom.descricao}
                    </Text>

                    <Text style={styles.validade}>
                      {cupom.validade}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.botaoUsar}
                    onPress={() => usarCupom(cupom.codigo)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.textoBotao}>
                      USAR
                    </Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <View style={styles.vazio}>
                <Ionicons
                  name="ticket-outline"
                  size={35}
                  color="#999999"
                />

                <Text style={styles.textoVazio}>
                  {aba === "meus"
                    ? "Você ainda não tem cupons salvos."
                    : "Não há cupons disponíveis no momento."}
                </Text>
              </View>
            )}
          </View>

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
    marginHorizontal: 40,
    borderBottomWidth: 2,
    borderBottomColor: "#888888",
    alignItems: "center",
    justifyContent: "center",
  },

  menu: {
    position: "absolute",
    right: -30,
    top: 25,
  },

  logo: {
    fontSize: 29,
    fontWeight: "300",
    letterSpacing: 6,
    color: "#080808",
    marginTop: 9,
  },

  ano: {
    fontSize: 11,
    color: "#111111",
    marginTop: 5,
  },

  conteudo: {
    flex: 1,
    paddingHorizontal: 27,
  },

  titulo: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111111",
    marginTop: 48,
    marginBottom: 12,
  },

  abas: {
    height: 44,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#D5D5D5",
    borderRadius: 3,
    marginBottom: 36,
  },

  aba: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "transparent",
  },

  abaAtiva: {
    borderBottomWidth: 2,
    borderBottomColor: "#111111",
  },

  textoAba: {
    fontSize: 14,
    color: "#BBBBBB",
  },

  textoAbaAtiva: {
    color: "#111111",
    fontWeight: "600",
  },

  lista: {
    borderWidth: 1,
    borderColor: "#D5D5D5",
    borderRadius: 2,
  },

  cartaoCupom: {
    minHeight: 102,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 12,
    paddingRight: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#D5D5D5",
  },

  ultimoCupom: {
    borderBottomWidth: 0,
  },

  informacoesCupom: {
    flex: 1,
    paddingRight: 8,
  },

  codigo: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111111",
    marginBottom: 4,
  },

  descricao: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 18,
  },

  validade: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 18,
  },

  botaoUsar: {
    width: 69,
    height: 33,
    borderWidth: 1,
    borderColor: "#D0D0D0",
    borderRadius: 3,
    alignItems: "center",
    justifyContent: "center",
  },

  textoBotao: {
    fontSize: 14,
    color: "#111111",
    fontWeight: "600",
  },

  vazio: {
    minHeight: 180,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },

  textoVazio: {
    color: "#777777",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 21,
  },

  espacoFinal: {
    height: 40,
  },
});
