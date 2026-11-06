
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function DadosPessoais() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cep, setCep] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      const dados = await AsyncStorage.getItem("dadosPessoais");

      if (dados !== null) {
        const informacoes = JSON.parse(dados);

        setNome(informacoes.nome || "");
        setEmail(informacoes.email || "");
        setTelefone(informacoes.telefone || "");
        setCep(informacoes.cep || "");
        setRua(informacoes.rua || "");
        setNumero(informacoes.numero || "");
        setComplemento(informacoes.complemento || "");
        setBairro(informacoes.bairro || "");
        setCidade(informacoes.cidade || "");
        setEstado(informacoes.estado || "");
      }
    } catch (erro) {
      Alert.alert("Erro", "Não foi possível carregar os dados.");
    }
  }

  async function salvarDados() {
    if (
      nome.trim() === "" ||
      email.trim() === "" ||
      telefone.trim() === "" ||
      cep.trim() === "" ||
      rua.trim() === "" ||
      numero.trim() === "" ||
      bairro.trim() === "" ||
      cidade.trim() === "" ||
      estado.trim() === ""
    ) {
      Alert.alert("Atenção", "Preencha todos os campos obrigatórios.");
      return;
    }

    const dados = {
      nome,
      email,
      telefone,
      cep,
      rua,
      numero,
      complemento,
      bairro,
      cidade,
      estado,
    };

    try {
      await AsyncStorage.setItem(
        "dadosPessoais",
        JSON.stringify(dados)
      );

      Alert.alert("Sucesso", "Seus dados foram salvos!");
    } catch (erro) {
      Alert.alert("Erro", "Não foi possível salvar os dados.");
    }
  }

  function campo(
    titulo: string,
    valor: string,
    alterar: (texto: string) => void,
    placeholder: string,
    teclado: "default" | "email-address" | "phone-pad" = "default"
  ) {
    return (
      <View style={styles.grupo}>
        <Text style={styles.label}>{titulo}</Text>

        <TextInput
          style={styles.input}
          value={valor}
          onChangeText={alterar}
          placeholder={placeholder}
          placeholderTextColor="#999999"
          keyboardType={teclado}
          autoCapitalize={
            teclado === "email-address" ? "none" : "words"
          }
        />
      </View>
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

            <TouchableOpacity
              style={styles.voltar}
              onPress={() => router.back()}
            >
              <Ionicons
                name="arrow-back"
                size={20}
                color="#111111"
              />
            </TouchableOpacity>

            <Text style={styles.logo}>BELLAVER</Text>

            <Text style={styles.ano}>EST. 1972</Text>

          </View>

          <View style={styles.linha} />

          {/* SUBTÍTULO */}

          <Text style={styles.subtitulo}>
            PAINEL DO ADMINISTRADOR
          </Text>

          {/* FOTO */}

          <TouchableOpacity style={styles.foto}>
            <Text style={styles.textoFoto}>Foto</Text>
          </TouchableOpacity>

          {/* FORMULÁRIO */}

          <View style={styles.formulario}>

            {campo(
              "Nome",
              nome,
              setNome,
              "Digite Seu Nome..."
            )}

            {campo(
              "E-mail",
              email,
              setEmail,
              "Digite Seu E-mail...",
              "email-address"
            )}

            {campo(
              "Telefone Celular",
              telefone,
              setTelefone,
              "Digite Seu Celular...",
              "phone-pad"
            )}

            {campo(
              "CEP",
              cep,
              setCep,
              "Digite Seu CEP...",
              "phone-pad"
            )}

            {campo(
              "Rua",
              rua,
              setRua,
              "Digite Sua Rua..."
            )}

            {campo(
              "Número",
              numero,
              setNumero,
              "Digite Seu Número...",
              "phone-pad"
            )}

            {campo(
              "Complemento",
              complemento,
              setComplemento,
              "Apartamento, bloco..."
            )}

            {campo(
              "Bairro",
              bairro,
              setBairro,
              "Digite Seu Bairro..."
            )}

            {campo(
              "Cidade",
              cidade,
              setCidade,
              "Digite Sua Cidade..."
            )}

            {campo(
              "Estado",
              estado,
              setEstado,
              "Digite Seu Estado..."
            )}

            {/* BOTÃO SALVAR */}

            <TouchableOpacity
              style={styles.botao}
              onPress={salvarDados}
              activeOpacity={0.8}
            >
              <Text style={styles.textoBotao}>
                Salvar
              </Text>
            </TouchableOpacity>

          </View>

          {/* RODAPÉ */}

          <Text style={styles.rodape}>
            Bellaver® - 2026
          </Text>

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
    paddingHorizontal: 16,
    paddingBottom: 15,
  },

  cabecalho: {
    height: 68,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  voltar: {
    position: "absolute",
    left: 0,
    top: 20,
    padding: 5,
  },

  logo: {
    fontSize: 20,
    fontWeight: "400",
    letterSpacing: 5,
    color: "#080808",
  },

  ano: {
    fontSize: 8,
    color: "#111111",
    marginTop: 4,
  },

  linha: {
    height: 1,
    backgroundColor: "#BBBBBB",
  },

  subtitulo: {
    textAlign: "center",
    fontSize: 7,
    color: "#999999",
    marginTop: 11,
    marginBottom: 22,
  },

  foto: {
    width: 60,
    height: 60,
    borderRadius: 50,
    backgroundColor: "#DDDDDD",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 22,
  },

  textoFoto: {
    fontSize: 11,
    color: "#333333",
  },

  formulario: {
    borderWidth: 1,
    borderColor: "#555555",
    borderRadius: 2,
    paddingHorizontal: 11,
    paddingTop: 8,
    paddingBottom: 10,
    backgroundColor: "#FFFFFF",
    elevation: 2,
  },

  grupo: {
    width: "100%",
    marginBottom: 5,
  },

  label: {
    fontSize: 10,
    color: "#111111",
    marginBottom: 2,
  },

  input: {
    height: 29,
    borderWidth: 1,
    borderColor: "#555555",
    borderRadius: 3,
    backgroundColor: "#EEEEEE",
    paddingHorizontal: 6,
    paddingVertical: 2,
    fontSize: 9,
    color: "#111111",
  },

  botao: {
    backgroundColor: "#000000",
    width: 70,
    height: 24,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 2,
    marginTop: 12,
  },

  textoBotao: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
  },

  rodape: {
    textAlign: "center",
    fontSize: 8,
    color: "#888888",
    marginTop: 35,
    marginBottom: 12,
  },

});
