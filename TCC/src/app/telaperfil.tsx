
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function Configuracao() {
  const router = useRouter();

  const opcoes = [
    {
      titulo: "Dados pessoais",
      icone: "person-outline" as const,
      acao: () => abrirPagina("Dados pessoais"),
    },
    {
      titulo: "Alterar senha",
      icone: "lock-closed-outline" as const,
      acao: () => abrirPagina("Alterar senha"),
    },
    {
      titulo: "Notificação",
      icone: "notifications-outline" as const,
      acao: () => abrirPagina("Notificação"),
    },
    {
      titulo: "Privacidade",
      icone: "lock-closed-outline" as const,
      acao: () => abrirPagina("Privacidade"),
    },
    {
      titulo: "Ajudar o suporte",
      icone: "headset-outline" as const,
      acao: () => abrirPagina("Ajudar o suporte"),
    },
    {
      titulo: "Sobre o aplicativo",
      icone: "help-circle-outline" as const,
      acao: () => abrirPagina("Sobre o aplicativo"),
    },
  ];

  function abrirPagina(nome: string) {
    Alert.alert(
      nome,
      `A página "${nome}" poderá ser conectada aqui.`
    );
  }

  function sair() {
    Alert.alert(
      "Sair da conta",
      "Tem certeza de que deseja sair do Bellaver?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Sair",
          style: "destructive",
          onPress: () => router.replace("/login"),
        },
      ]
    );
  }

  return (
    <SafeAreaView style={styles.tela}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
      />

      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.conteudo}
        >
          {/* CABEÇALHO */}
          <View style={styles.cabecalho}>
            <Text style={styles.logo}>BELLAVER</Text>
            <Text style={styles.ano}>EST. 1972</Text>

            <TouchableOpacity
              style={styles.botaoSairTopo}
              onPress={sair}
              accessibilityLabel="Sair da conta"
            >
              <Ionicons
                name="log-out-outline"
                size={25}
                color="#111111"
              />
            </TouchableOpacity>
          </View>

          {/* CONFIGURAÇÕES */}
          <View style={styles.secao}>
            <Text style={styles.titulo}>Configuração</Text>
          </View>

          {/* OPÇÕES */}
          <View style={styles.lista}>
            {opcoes.map((opcao) => (
              <TouchableOpacity
                key={opcao.titulo}
                style={styles.item}
                onPress={opcao.acao}
                activeOpacity={0.6}
              >
                <Ionicons
                  name={opcao.icone}
                  size={23}
                  color="#111111"
                />

                <Text style={styles.textoItem}>
                  {opcao.titulo}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* BOTÃO SAIR */}
          <TouchableOpacity
            style={styles.botaoSair}
            onPress={sair}
            activeOpacity={0.8}
          >
            <Text style={styles.textoBotaoSair}>
              SAIR
            </Text>
          </TouchableOpacity>
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

  conteudo: {
    flexGrow: 1,
    paddingHorizontal: 19,
    paddingBottom: 25,
  },

  cabecalho: {
    height: 178,
    borderBottomWidth: 1,
    borderBottomColor: "#BBBBBB",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  logo: {
    fontSize: 29,
    fontWeight: "300",
    letterSpacing: 6,
    color: "#080808",
    marginTop: 5,
  },

  ano: {
    fontSize: 11,
    color: "#111111",
    marginTop: 5,
  },

  botaoSairTopo: {
    position: "absolute",
    right: 5,
    top: 25,
    padding: 3,
  },

  secao: {
    height: 80,
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#BBBBBB",
  },

  titulo: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111111",
    marginLeft: 7,
  },

  lista: {
    width: "100%",
  },

  item: {
    height: 68,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#BBBBBB",
  },

  textoItem: {
    fontSize: 16,
    color: "#111111",
    marginLeft: 12,
  },

  botaoSair: {
    height: 55,
    backgroundColor: "#000000",
    borderRadius: 3,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },

  textoBotaoSair: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
