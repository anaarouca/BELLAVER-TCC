
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
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";

const CHAVE_AVALIACOES = "@bellaver/avaliacoes";

type Avaliacao = {
  produto: string;
  nota: number;
  comentario: string;
  fotos: string[];
  enviadaEm: string;
};

export default function AvaliarProduto() {
  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState("");
  const [fotos, setFotos] = useState<string[]>([]);
  const [enviando, setEnviando] = useState(false);

  async function adicionarFoto(origem: "camera" | "galeria") {
    if (fotos.length >= 3) {
      Alert.alert("Limite atingido", "Você pode adicionar até 3 fotos.");
      return;
    }

    try {
      const permissao =
        origem === "camera"
          ? await ImagePicker.requestCameraPermissionsAsync()
          : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissao.granted) {
        Alert.alert(
          "Permissão necessária",
          origem === "camera"
            ? "Permita o acesso à câmera para tirar uma foto."
            : "Permita o acesso às fotos para escolher uma imagem."
        );
        return;
      }

      const opcoes = {
        mediaTypes: ["images"] as ("images")[],
        allowsEditing: true,
        quality: 0.8,
      };
      const resultado =
        origem === "camera"
          ? await ImagePicker.launchCameraAsync(opcoes)
          : await ImagePicker.launchImageLibraryAsync(opcoes);

      if (!resultado.canceled && resultado.assets.length > 0) {
        setFotos((fotosAtuais) => [...fotosAtuais, resultado.assets[0].uri]);
      }
    } catch (erro) {
      console.error("Erro ao adicionar foto à avaliação:", erro);
      Alert.alert(
        "Não foi possível adicionar a foto",
        "Tente novamente."
      );
    }
  }

  function removerFoto(index: number) {
    setFotos((fotosAtuais) => fotosAtuais.filter((_, i) => i !== index));
  }

  async function enviarAvaliacao() {
    if (nota === 0) {
      Alert.alert(
        "Avaliação incompleta",
        "Selecione de 1 a 5 estrelas para avaliar o produto."
      );
      return;
    }

    if (enviando) return;

    const avaliacao: Avaliacao = {
      produto: "Colete Alfaiataria Risca de Giz Hudson",
      nota,
      comentario: comentario.trim(),
      fotos,
      enviadaEm: new Date().toISOString(),
    };

    try {
      setEnviando(true);
      const dadosSalvos = await AsyncStorage.getItem(CHAVE_AVALIACOES);
      const avaliacoesSalvas: unknown = dadosSalvos
        ? JSON.parse(dadosSalvos)
        : [];

      if (!Array.isArray(avaliacoesSalvas)) {
        throw new Error("Os dados de avaliações salvos estão inválidos.");
      }

      await AsyncStorage.setItem(
        CHAVE_AVALIACOES,
        JSON.stringify([...avaliacoesSalvas, avaliacao])
      );

      router.replace("/mensagem3");
      setNota(0);
      setComentario("");
      setFotos([]);
    } catch (erro) {
      console.error("Erro ao salvar avaliação:", erro);
      Alert.alert(
        "Não foi possível enviar",
        "Tente novamente em alguns instantes."
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <SafeAreaView style={styles.tela}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

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
          keyboardShouldPersistTaps="handled"
        >
          {/* AVISO DE ENTREGA */}
          <View style={styles.aviso}>
            <Text style={styles.tituloAviso}>
              COMPARTILHE SUA OPINIÃO
            </Text>

            <Text style={styles.subtituloAviso}>
              Avalie o produto.
            </Text>
          </View>

          <View style={styles.divisor} />

          {/* TÍTULO */}
          <Text style={styles.titulo}>Avaliar produto</Text>

          {/* PRODUTO */}
          <View style={styles.produto}>
            <Image
              source={require("../../assets/Img/ColeteAlfaiatariaRisca.png")}
              style={styles.fotoProduto}
              resizeMode="cover"
            />

            <View style={styles.detalhesProduto}>
              <Text style={styles.nomeProduto}>
                Colete Alfaiataria
                {"\n"}
                Risca de Giz Hudson
              </Text>

            </View>
          </View>

          {/* ESTRELAS */}
          <View style={styles.estrelas}>
            {[1, 2, 3, 4, 5].map((estrela) => (
              <TouchableOpacity
                key={estrela}
                onPress={() => setNota(estrela)}
                accessibilityRole="button"
                accessibilityLabel={`${estrela} ${
                  estrela === 1 ? "estrela" : "estrelas"
                }`}
              >
                <Ionicons
                  name={estrela <= nota ? "star" : "star-outline"}
                  size={31}
                  color={estrela <= nota ? "#111111" : "#858585"}
                />
              </TouchableOpacity>
            ))}
          </View>

          {nota > 0 && (
            <Text style={styles.notaSelecionada}>
              {nota} de 5 estrelas
            </Text>
          )}

          {/* COMENTÁRIO */}
          <View style={styles.comentarioArea}>
            <TextInput
              style={styles.comentario}
              placeholder="Conte o que você achou do produto..."
              placeholderTextColor="#C7C7C7"
              multiline
              textAlignVertical="top"
              maxLength={500}
              value={comentario}
              onChangeText={setComentario}
            />

            <Text style={styles.contador}>
              {comentario.length}/500
            </Text>
          </View>

          {/* FOTOS */}
          <Text style={styles.tituloFotos}>
            Adicionar fotos (opcional)
          </Text>

          <View style={styles.listaFotos}>
            {[0, 1, 2].map((index) => (
              <TouchableOpacity
                key={index}
                style={styles.quadroFoto}
                onPress={() => {
                  if (fotos[index]) {
                    Alert.alert("Foto", "Deseja remover esta foto?", [
                      { text: "Cancelar", style: "cancel" },
                      {
                        text: "Remover",
                        style: "destructive",
                        onPress: () => removerFoto(index),
                      },
                    ]);
                  } else {
                    Alert.alert("Adicionar foto", "Escolha como adicionar a foto.", [
                      {
                        text: "Tirar foto",
                        onPress: () => adicionarFoto("camera"),
                      },
                      {
                        text: "Escolher da galeria",
                        onPress: () => adicionarFoto("galeria"),
                      },
                      { text: "Cancelar", style: "cancel" },
                    ]);
                  }
                }}
              >
                {fotos[index] ? (
                  <Image
                    source={{ uri: fotos[index] }}
                    style={styles.imagemSelecionada}
                  />
                ) : index < 2 ? (
                  <Ionicons
                    name="camera-outline"
                    size={38}
                    color="#111111"
                  />
                ) : (
                  <Ionicons
                    name="add"
                    size={43}
                    color="#111111"
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* ENVIAR */}
          <TouchableOpacity
            style={styles.botaoEnviar}
            onPress={enviarAvaliacao}
            activeOpacity={0.8}
            disabled={enviando}
          >
            <Text style={styles.textoBotao}>
              {enviando ? "ENVIANDO..." : "ENVIAR A AVALIAÇÃO"}
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
    height: 125,
    marginHorizontal: 29,
    borderBottomWidth: 2,
    borderBottomColor: "#888888",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 8,
  },

  menu: {
    position: "absolute",
    right: -2,
    top: 26,
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
    paddingHorizontal: 29,
  },

  aviso: {
    alignItems: "center",
    paddingTop: 36,
    paddingBottom: 31,
  },

  tituloAviso: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111111",
  },

  subtituloAviso: {
    fontSize: 13,
    color: "#111111",
    marginTop: 8,
  },

  divisor: {
    height: 2,
    backgroundColor: "#888888",
    marginBottom: 24,
    marginRight: 8,
  },

  titulo: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111111",
    marginBottom: 13,
  },

  produto: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  fotoProduto: {
    width: 141,
    height: 146,
  },

  detalhesProduto: {
    flex: 1,
    paddingLeft: 17,
  },

  nomeProduto: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111111",
    lineHeight: 20,
  },

  dataCompra: {
    fontSize: 13,
    color: "#111111",
    marginTop: 10,
    lineHeight: 19,
  },

  estrelas: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    marginTop: 20,
    marginBottom: 10,
  },

  notaSelecionada: {
    textAlign: "center",
    color: "#666666",
    fontSize: 12,
    marginBottom: 8,
  },

  comentarioArea: {
    marginTop: 1,
  },

  comentario: {
    height: 117,
    borderWidth: 1,
    borderColor: "#111111",
    borderRadius: 4,
    padding: 8,
    fontSize: 13,
    color: "#111111",
    marginHorizontal: 5,
  },

  contador: {
    fontSize: 12,
    color: "#111111",
    textAlign: "right",
    marginTop: 7,
  },

  tituloFotos: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111111",
    marginTop: 7,
    marginBottom: 23,
  },

  listaFotos: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 6,
  },

  quadroFoto: {
    width: "29%",
    aspectRatio: 1,
    borderWidth: 1,
    borderColor: "#111111",
    borderRadius: 3,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  imagemSelecionada: {
    width: "100%",
    height: "100%",
  },

  botaoEnviar: {
    height: 54,
    backgroundColor: "#000000",
    borderRadius: 3,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 38,
    marginHorizontal: 7,
  },

  textoBotao: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "400",
  },

  espacoFinal: {
    height: 30,
  },
});
