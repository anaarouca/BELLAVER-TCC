
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function Cupons() {
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

          {/* LISTA DE CUPONS */}
          <View style={styles.lista}>
            {cupons.map((cupom, index) => (
                <View
                  key={cupom.codigo}
                  style={[
                    styles.cartaoCupom,
                    index === cupons.length - 1 &&
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
                    onPress={() =>
                      router.push({
                        pathname: "/sacola",
                        params: { cupom: cupom.codigo },
                      })
                    }
                    activeOpacity={0.7}
                  >
                    <Text style={styles.textoBotao}>
                      USAR
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
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
    height: 130,
    marginHorizontal: 29,
    borderBottomWidth: 2,
    borderBottomColor: "#888888",
    alignItems: "center",
    justifyContent: "center",
  },

  menu: {
    position: "absolute",
    right: -2,
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
    paddingHorizontal: 30,
  },

  titulo: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111111",
    marginTop: 41,
    marginBottom: 0,
    marginHorizontal: 28,
  },

  lista: {
    width: "88%",
    alignSelf: "center",
    marginTop: 47,
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

  espacoFinal: {
    height: 40,
  },
});
