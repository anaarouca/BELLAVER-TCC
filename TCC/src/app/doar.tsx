
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";

const categorias = [
  "Vestido",
  "Blusa",
  "Calça",
  "Saia",
  "Jaqueta",
  "Casaco",
  "Bolsa",
  "Calçado",
  "Acessório",
];

const tamanhos = ["36", "38", "40", "42", "44"];

const estados = [
  "Novo",
  "Seminovo",
  "Usado - Excelente estado",
  "Usado - Bom estado",
  "Usado - Estado regular",
  "Usado - Estado ruim",
];

const ongs = [
  {
    nome: "Instituto Velho Amigo",
    descricao:
      "Apoio a idosos e melhoria de abrigos parceiros através do Programa Revitaliza e núcleos sociais.",
  },
  {
    nome: "Instituto Heleninha",
    descricao:
      "Suporte e transporte de crianças e jovens em situação de vulnerabilidade com diagnóstico de câncer.",
  },
  {
    nome: "AMPARA Animal",
    descricao:
      "Proteção, resgate e conscientização voltados a animais domésticos e fauna silvestre (AMPARA Silvestre).",
  },
  {
    nome: "Teto Brasil",
    descricao:
      "Desenvolvimento comunitário e construção de moradias emergenciais em favelas e periferias.",
  },
];

export default function Doar() {
  const [nome, setNome] = useState("");
  const [marca, setMarca] = useState("");
  const [categoria, setCategoria] = useState("");
  const [tamanho, setTamanho] = useState("");
  const [estado, setEstado] = useState("");
  const [preco, setPreco] = useState("");
  const [descricao, setDescricao] = useState("");
  const [ong, setOng] = useState("");
  const [fotos, setFotos] = useState<string[]>([]);
  const [filtroAberto, setFiltroAberto] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [sucesso, setSucesso] = useState(false);

  async function adicionarFotos() {
    const permissao =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissao.granted) {
      setMensagem("Precisamos acessar suas fotos para adicionar imagens da peça.");
      setSucesso(false);
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 5,
      quality: 0.8,
    });

    if (!resultado.canceled) {
      const novasFotos = resultado.assets.map((foto) => foto.uri);

      setFotos((anteriores) =>
        [...anteriores, ...novasFotos].slice(0, 5)
      );

      setMensagem("");
    }
  }

  function removerFoto(uri: string) {
    setFotos((anteriores) =>
      anteriores.filter((foto) => foto !== uri)
    );
  }

  function cadastrarProduto() {
    const camposFaltando: string[] = [];

    if (!nome.trim()) camposFaltando.push("Nome da peça");
    if (!marca.trim()) camposFaltando.push("Marca");
    if (!categoria) camposFaltando.push("Categoria");
    if (!tamanho) camposFaltando.push("Tamanho");
    if (!estado) camposFaltando.push("Estado da peça");
    if (!preco.trim()) camposFaltando.push("Preço");
    if (!descricao.trim()) camposFaltando.push("Descrição");
    if (fotos.length === 0) camposFaltando.push("Fotos da peça");
    if (!ong) camposFaltando.push("ONG escolhida");

    if (camposFaltando.length > 0) {
      setMensagem(
        "Preencha as informações obrigatórias:\n\n" +
          camposFaltando.map((campo) => "• " + campo).join("\n")
      );
      setSucesso(false);
      return;
    }

    setMensagem("Produto cadastrado com sucesso para doação à BELLAHOPE!");
    setSucesso(true);
  }

  function abrirFiltro(
    titulo: string,
    opcoes: string[]
  ) {
    return (
      <View style={styles.filtroContainer}>
        <TouchableOpacity
          style={styles.filtroBotao}
          onPress={() =>
            setFiltroAberto(
              filtroAberto === titulo ? "" : titulo
            )
          }
        >
          <Text
            style={[
              styles.filtroTexto,
              !opcoes.includes(
                titulo === "Categoria"
                  ? categoria
                  : titulo === "Tamanho"
                    ? tamanho
                    : estado
              ) && styles.placeholder,
            ]}
          >
            {titulo === "Categoria"
              ? categoria || "Selecione uma categoria"
              : titulo === "Tamanho"
                ? tamanho || "Selecione o Tamanho"
                : estado || "Selecione o estado"}
          </Text>

          <Feather
            name={
              filtroAberto === titulo
                ? "chevron-up"
                : "chevron-down"
            }
            size={16}
            color="#111111"
          />
        </TouchableOpacity>

        {filtroAberto === titulo && (
          <View style={styles.listaOpcoes}>
            {opcoes.map((opcao) => (
              <TouchableOpacity
                key={opcao}
                style={styles.opcao}
                onPress={() => {
                  if (titulo === "Categoria") setCategoria(opcao);
                  if (titulo === "Tamanho") setTamanho(opcao);
                  if (titulo === "Estado da Peça") setEstado(opcao);

                  setFiltroAberto("");
                  setMensagem("");
                }}
              >
                <Text style={styles.opcaoTexto}>{opcao}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.brand}>
          <TouchableOpacity
            style={styles.botaoVoltar}
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace("/home");
              }
            }}
          >
            <Feather name="arrow-left" size={23} color="#111111" />
          </TouchableOpacity>

          <Text style={styles.brandName}>BELLAHOPE</Text>
        </View>

        <View style={styles.formulario}>
          <Text style={styles.label}>Nome da peça</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite o nome da peça..."
            placeholderTextColor="#999999"
            value={nome}
            onChangeText={(valor) => {
              setNome(valor);
              setMensagem("");
            }}
          />

          <Text style={styles.label}>Marca</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite a marca..."
            placeholderTextColor="#999999"
            value={marca}
            onChangeText={(valor) => {
              setMarca(valor);
              setMensagem("");
            }}
          />

          <Text style={styles.label}>Categoria</Text>
          {abrirFiltro("Categoria", categorias)}

          <Text style={styles.label}>Tamanho</Text>
          {abrirFiltro("Tamanho", tamanhos)}

          <Text style={styles.label}>Estado da Peça</Text>
          {abrirFiltro("Estado da Peça", estados)}

          <Text style={styles.label}>Preço(R$)</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite o preço..."
            placeholderTextColor="#999999"
            keyboardType="decimal-pad"
            value={preco}
            onChangeText={(valor) => {
              setPreco(valor);
              setMensagem("");
            }}
          />

          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Descreva sua peça (tecido, cor, detalhes, qual ano)..."
            placeholderTextColor="#999999"
            multiline
            textAlignVertical="top"
            value={descricao}
            onChangeText={(valor) => {
              setDescricao(valor);
              setMensagem("");
            }}
          />

          <Text style={styles.label}>Fotos da Peça</Text>

          <TouchableOpacity
            style={styles.upload}
            onPress={adicionarFotos}
            activeOpacity={0.8}
          >
            {fotos.length === 0 ? (
              <>
                <Feather
                  name="image"
                  size={42}
                  color="#000000"
                />
                <Text style={styles.uploadTexto}>
                  Clique para adicionar fotos
                </Text>
                <Text style={styles.uploadSubtexto}>
                  Ou arraste e solte aqui
                </Text>
              </>
            ) : (
              <View style={styles.fotosContainer}>
                {fotos.map((foto) => (
                  <View key={foto} style={styles.fotoItem}>
                    <Image
                      source={{ uri: foto }}
                      style={styles.foto}
                    />
                    <TouchableOpacity
                      style={styles.removerFoto}
                      onPress={() => removerFoto(foto)}
                    >
                      <Feather
                        name="x"
                        size={14}
                        color="#ffffff"
                      />
                    </TouchableOpacity>
                  </View>
                ))}

                {fotos.length < 5 && (
                  <TouchableOpacity
                    style={styles.adicionarOutra}
                    onPress={adicionarFotos}
                  >
                    <Feather
                      name="plus"
                      size={28}
                      color="#111111"
                    />
                    <Text style={styles.adicionarTexto}>
                      Adicionar
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </TouchableOpacity>

          <Text style={styles.labelONG}>
            Escolha a ONG para a qual o dinheiro será doado
          </Text>

          <View style={styles.filtroContainer}>
            <TouchableOpacity
              style={styles.filtroBotao}
              onPress={() =>
                setFiltroAberto(
                  filtroAberto === "ONG" ? "" : "ONG"
                )
              }
            >
              <View style={styles.ongSelecionada}>
                <Text style={styles.ongNome}>
                  {ong || "Selecione a ONG"}
                </Text>
                {ong !== "" && (
                  <Text style={styles.ongDescricao}>
                    {ongs.find((item) => item.nome === ong)?.descricao}
                  </Text>
                )}
              </View>

              <Feather
                name={
                  filtroAberto === "ONG"
                    ? "chevron-up"
                    : "chevron-down"
                }
                size={16}
                color="#111111"
              />
            </TouchableOpacity>

            {filtroAberto === "ONG" && (
              <View style={styles.listaONG}>
                {ongs.map((item) => (
                  <TouchableOpacity
                    key={item.nome}
                    style={styles.opcaoONG}
                    onPress={() => {
                      setOng(item.nome);
                      setFiltroAberto("");
                      setMensagem("");
                    }}
                  >
                    <Text style={styles.nomeONG}>
                      {item.nome}
                    </Text>
                    <Text style={styles.descricaoONG}>
                      {item.descricao}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {mensagem !== "" && (
            <View
              style={[
                styles.mensagemContainer,
                sucesso && styles.mensagemSucesso,
              ]}
            >
              <Feather
                name={sucesso ? "check-circle" : "alert-circle"}
                size={18}
                color={sucesso ? "#245c36" : "#111111"}
              />
              <Text style={styles.mensagemTexto}>
                {mensagem}
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.botaoCadastrar}
            onPress={cadastrarProduto}
            activeOpacity={0.8}
          >
            <Text style={styles.textoBotao}>
              Cadastrar Produto
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>Bellaver© - 2026</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scroll: {
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  brand: {
    height: 92,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  botaoVoltar: {
    position: "absolute",
    left: 5,
    top: 30,
    width: 35,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
  },
  brandName: {
    color: "#242424",
    fontSize: 19,
    fontWeight: "300",
    letterSpacing: 4,
  },
  formulario: {
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "#222222",
    borderRadius: 3,
    padding: 9,
    paddingTop: 10,
    paddingBottom: 18,
    backgroundColor: "#ffffff",
    elevation: 3,
  },
  label: {
    color: "#111111",
    fontSize: 13,
    marginBottom: 5,
    marginTop: 4,
  },
  input: {
    height: 26,
    borderWidth: 1,
    borderColor: "#333333",
    borderRadius: 3,
    backgroundColor: "#eeeeee",
    paddingHorizontal: 8,
    fontSize: 10,
    color: "#111111",
    marginBottom: 4,
  },
  textArea: {
    height: 66,
    paddingTop: 8,
  },
  filtroContainer: {
    marginBottom: 4,
  },
  filtroBotao: {
    minHeight: 27,
    borderWidth: 1,
    borderColor: "#333333",
    borderRadius: 3,
    backgroundColor: "#eeeeee",
    paddingHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  filtroTexto: {
    fontSize: 10,
    color: "#111111",
  },
  placeholder: {
    color: "#888888",
  },
  listaOpcoes: {
    borderWidth: 1,
    borderColor: "#333333",
    borderTopWidth: 0,
    backgroundColor: "#eeeeee",
    paddingVertical: 3,
  },
  opcao: {
    minHeight: 17,
    justifyContent: "center",
    paddingHorizontal: 9,
  },
  opcaoTexto: {
    color: "#333333",
    fontSize: 10,
  },
  upload: {
    minHeight: 106,
    borderWidth: 1,
    borderColor: "#333333",
    borderRadius: 3,
    backgroundColor: "#eeeeee",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    padding: 8,
  },
  uploadTexto: {
    color: "#111111",
    fontSize: 11,
    marginTop: 4,
  },
  uploadSubtexto: {
    color: "#999999",
    fontSize: 9,
    marginTop: 2,
  },
  fotosContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
  },
  fotoItem: {
    position: "relative",
  },
  foto: {
    width: 75,
    height: 75,
    borderRadius: 3,
  },
  removerFoto: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#111111",
    borderRadius: 12,
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  adicionarOutra: {
    width: 75,
    height: 75,
    borderWidth: 1,
    borderColor: "#888888",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  adicionarTexto: {
    fontSize: 9,
    color: "#555555",
  },
  labelONG: {
    color: "#111111",
    fontSize: 11,
    marginBottom: 5,
    marginTop: 2,
  },
  ongSelecionada: {
    flex: 1,
    paddingVertical: 5,
    paddingRight: 5,
  },
  ongNome: {
    color: "#111111",
    fontSize: 10,
  },
  ongDescricao: {
    color: "#888888",
    fontSize: 8,
    marginTop: 2,
  },
  listaONG: {
    borderWidth: 1,
    borderColor: "#333333",
    borderTopWidth: 0,
    backgroundColor: "#ffffff",
  },
  opcaoONG: {
    paddingHorizontal: 8,
    paddingVertical: 7,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#cccccc",
  },
  nomeONG: {
    color: "#111111",
    fontSize: 10,
    fontWeight: "600",
  },
  descricaoONG: {
    color: "#888888",
    fontSize: 9,
    marginTop: 2,
    lineHeight: 12,
  },
  mensagemContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: "#eeeeee",
    borderWidth: 1,
    borderColor: "#999999",
    padding: 10,
    marginTop: 10,
    borderRadius: 3,
  },
  mensagemSucesso: {
    backgroundColor: "#edf5ee",
    borderColor: "#8aaa91",
  },
  mensagemTexto: {
    flex: 1,
    color: "#111111",
    fontSize: 12,
    lineHeight: 18,
  },
  botaoCadastrar: {
    height: 33,
    backgroundColor: "#000000",
    borderRadius: 3,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
  },
  textoBotao: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "600",
  },
  footer: {
    color: "#888888",
    fontSize: 9,
    textAlign: "center",
    marginTop: 13,
  },
});
