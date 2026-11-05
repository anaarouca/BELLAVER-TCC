
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Linking,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Rastreamento() {
  const pedido = {
    numero: "12345",
    transportadora: "Loggi",
    codigo: "AB12345678BR",
  };

  const etapas = [
    {
      titulo: "Pedido confirmado",
      data: "13/05/2025 - 10:25",
      concluido: true,
    },
    {
      titulo: "Em separação",
      data: "13/05/2025 - 14:25",
      concluido: true,
    },
    {
      titulo: "Pedido enviado",
      data: "14/05/2025 - 09:15",
      concluido: false,
    },
    {
      titulo: "Pedido entregue",
      data: "Previsão: 16/05/2025 - 10:25",
      concluido: false,
    },
  ];

  async function abrirTransportadora() {
    const url = "https://www.loggi.com/rastreador/";

    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert(
        "Não foi possível abrir",
        "Tente acessar o site da transportadora novamente."
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
        {/* CABEÇALHO BELLAVER */}
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
            Rastreamento do pedido
          </Text>

          <Text style={styles.numeroPedido}>
            Pedido #{pedido.numero}
          </Text>

          {/* LINHA DO TEMPO */}
          <View style={styles.linhaTempo}>
            {etapas.map((etapa, index) => (
              <View style={styles.etapa} key={etapa.titulo}>
                <View style={styles.colunaLinha}>
                  <View
                    style={[
                      styles.bolinha,
                      etapa.concluido
                        ? styles.bolinhaConcluida
                        : styles.bolinhaPendente,
                    ]}
                  />

                  {index !== etapas.length - 1 && (
                    <View style={styles.linhaVertical} />
                  )}
                </View>

                <View style={styles.conteudoEtapa}>
                  <Text style={styles.tituloEtapa}>
                    {etapa.titulo}
                  </Text>

                  <Text style={styles.dataEtapa}>
                    {etapa.data}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* INFORMAÇÕES DE ENTREGA */}
          <View style={styles.informacoes}>
            <Text style={styles.rotulo}>
              Transportadora
            </Text>

            <Text style={styles.valor}>
              {pedido.transportadora}
            </Text>

            <Text style={[styles.rotulo, styles.rotuloCodigo]}>
              Código de rastreio
            </Text>

            <Text style={styles.valor}>
              {pedido.codigo}
            </Text>
          </View>

          {/* BOTÃO */}
          <TouchableOpacity
            style={styles.botao}
            onPress={abrirTransportadora}
            activeOpacity={0.8}
          >
            <Text style={styles.textoBotao}>
              VER SITE DA TRANSPORTADORA
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
    marginHorizontal: 29,
    borderBottomWidth: 2,
    borderBottomColor: "#888888",
    alignItems: "center",
    justifyContent: "center",
  },

  menu: {
    position: "absolute",
    right: -2,
    top: 27,
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
    textAlign: "center",
    color: "#111111",
    marginTop: 19,
  },

  numeroPedido: {
    fontSize: 16,
    color: "#111111",
    marginTop: 20,
    marginBottom: 25,
  },

  linhaTempo: {
    marginLeft: 31,
  },

  etapa: {
    flexDirection: "row",
    minHeight: 121,
  },

  colunaLinha: {
    width: 34,
    alignItems: "center",
    position: "relative",
  },

  bolinha: {
    width: 25,
    height: 25,
    borderRadius: 13,
    zIndex: 1,
  },

  bolinhaConcluida: {
    backgroundColor: "#000000",
    borderWidth: 1,
    borderColor: "#000000",
  },

  bolinhaPendente: {
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#000000",
  },

  linhaVertical: {
    position: "absolute",
    top: 24,
    width: 1,
    height: 97,
    backgroundColor: "#111111",
  },

  conteudoEtapa: {
    flex: 1,
    paddingLeft: 12,
    paddingTop: 5,
  },

  tituloEtapa: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111111",
  },

  dataEtapa: {
    fontSize: 14,
    color: "#333333",
    marginTop: 24,
    lineHeight: 20,
  },

  informacoes: {
    borderTopWidth: 2,
    borderTopColor: "#888888",
    marginTop: 2,
    marginHorizontal: -6,
    paddingTop: 15,
    paddingHorizontal: 2,
  },

  rotulo: {
    fontSize: 15,
    color: "#111111",
  },

  valor: {
    fontSize: 15,
    color: "#111111",
    marginTop: 8,
    marginLeft: 7,
  },

  rotuloCodigo: {
    marginTop: 27,
  },

  botao: {
    height: 52,
    backgroundColor: "#000000",
    borderRadius: 3,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 22,
    marginHorizontal: -3,
    elevation: 3,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },

  textoBotao: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  espacoFinal: {
    height: 30,
  },
});
