
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
          autoCapitalize={teclado === "email-address" ? "none" : "words"}
        />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.tela}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.conteudo}
        >
          <View style={styles.cabecalho}>
            <TouchableOpacity
              style={styles.voltar}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="#111111" />
            </TouchableOpacity>

            <Text style={styles.logo}>BELLAVER</Text>
            <Text style={styles.ano}>EST. 1972</Text>
          </View>

          <View style={styles.tituloContainer}>
            <Text style={styles.titulo}>Dados pessoais</Text>
            <Text style={styles.subtitulo}>
              Mantenha suas informações atualizadas.
            </Text>
          </View>

          <View style={styles.formulario}>
            {campo("Nome completo *", nome, setNome, "Seu nome completo")}
            {campo("E-mail *", email, setEmail, "Seu e-mail", "email-address")}
            {campo("Telefone *", telefone, setTelefone, "(00) 00000-0000", "phone-pad")}
            {campo("CEP *", cep, setCep, "00000-000", "phone-pad")}
            {campo("Rua *", rua, setRua, "Nome da rua")}
            {campo("Número *", numero, setNumero, "Número do endereço", "phone-pad")}
            {campo("Complemento", complemento, setComplemento, "Apartamento, bloco...")}
            {campo("Bairro *", bairro, setBairro, "Seu bairro")}
            {campo("Cidade *", cidade, setCidade, "Sua cidade")}
            {campo("Estado *", estado, setEstado, "Ex: SP")}
          </View>

          <TouchableOpacity
            style={styles.botao}
            onPress={salvarDados}
            activeOpacity={0.8}
          >
            <Text style={styles.textoBotao}>SALVAR ALTERAÇÕES</Text>
          </TouchableOpacity>

          <Text style={styles.observacao}>
            * Campos obrigatórios
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
    paddingHorizontal: 22,
    paddingBottom: 30,
  },
  cabecalho: {
    height: 145,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#BBBBBB",
    position: "relative",
  },
  voltar: {
    position: "absolute",
    left: 0,
    top: 25,
    padding: 5,
  },
  logo: {
    fontSize: 28,
    fontWeight: "300",
    letterSpacing: 6,
    color: "#080808",
  },
  ano: {
    fontSize: 11,
    color: "#111111",
    marginTop: 5,
  },
  tituloContainer: {
    paddingVertical: 25,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "600",
    color: "#111111",
  },
  subtitulo: {
    fontSize: 13,
    color: "#777777",
    marginTop: 7,
  },
  formulario: {
    gap: 17,
  },
  grupo: {
    width: "100%",
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#222222",
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#BBBBBB",
    borderRadius: 3,
    paddingHorizontal: 12,
    fontSize: 14,
    color: "#111111",
    backgroundColor: "#FFFFFF",
  },
  botao: {
    height: 53,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 28,
    borderRadius: 3,
  },
  textoBotao: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 1,
  },
  observacao: {
    color: "#888888",
    fontSize: 11,
    marginTop: 12,
    textAlign: "center",
  },
});
