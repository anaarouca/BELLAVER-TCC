
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type FiltrosProps = {
  onVoltar?: () => void;
  onAplicar?: (filtros: {
    tamanho: string;
    preco: number;
    marca: string;
    categoria: string;
  }) => void;
};

const tamanhos = ["36", "38", "40", "42", "44"];

const precos = [
  { valor: 0, texto: "R$ 0" },
  { valor: 125, texto: "R$ 125" },
  { valor: 250, texto: "R$ 250" },
  { valor: 375, texto: "R$ 375" },
  { valor: 500, texto: "R$ 500+" },
];

const marcas = [
  "Todas as Marcas",
  "Bellaver",
  "Gucci",
  "Prada",
  "Chanel",
  "Zara",
];

const categorias = [
  "Todas as Categorias",
  "Vestidos",
  "Conjuntos",
  "Calças",
  "Blusas",
  "Casacos",
  "Bolsas",
  "Calçados",
];

export default function Filtros({
  onVoltar,
  onAplicar,
}: FiltrosProps) {
  const [tamanho, setTamanho] = useState("");
  const [preco, setPreco] = useState(250);
  const [marca, setMarca] = useState("Todas as Marcas");
  const [categoria, setCategoria] = useState("Todas as Categorias");

  const [seletorAberto, setSeletorAberto] = useState(false);
  const [tipoSeletor, setTipoSeletor] = useState<"marca" | "categoria">(
    "marca"
  );

  function abrirSeletor(tipo: "marca" | "categoria") {
    setTipoSeletor(tipo);
    setSeletorAberto(true);
  }

  function limparFiltros() {
    setTamanho("");
    setPreco(250);
    setMarca("Todas as Marcas");
    setCategoria("Todas as Categorias");
  }

  function aplicarFiltros() {
    if (onAplicar) {
      onAplicar({
        tamanho,
        preco,
        marca,
        categoria,
      });
    }
  }

  const opcoes =
    tipoSeletor === "marca" ? marcas : categorias;

  return (
    <SafeAreaView style={styles.tela}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
      />

      <View style={styles.aplicativo}>
        {/* Cabeçalho Bellaver */}
        <View style={styles.cabecalho}>
          <TouchableOpacity
            style={styles.botaoMenu}
            onPress={onVoltar}
            accessibilityLabel="Voltar para pesquisa"
          >
            <Ionicons
              name="menu-outline"
              size={26}
              color="#111111"
            />
          </TouchableOpacity>

          <View style={styles.marcaLogo}>
            <Text style={styles.nomeMarca}>BELLAVER</Text>
            <Text style={styles.anoMarca}>EST. 1972</Text>
          </View>
        </View>

        <ScrollView
          style={styles.conteudo}
          showsVerticalScrollIndicator={false}
        >
          {/* Título */}
          <View style={styles.tituloPagina}>
            <TouchableOpacity
              onPress={onVoltar}
              style={styles.botaoVoltar}
              accessibilityLabel="Voltar"
            >
              <Ionicons
                name="chevron-back"
                size={23}
                color="#111111"
              />
            </TouchableOpacity>

            <Text style={styles.titulo}>Filtros</Text>

            <View style={styles.espacoTitulo} />
          </View>

          {/* Tamanho */}
          <View style={styles.secaoTamanho}>
            <Text style={styles.rotulo}>Tamanho</Text>

            <View style={styles.listaTamanhos}>
              {tamanhos.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.botaoTamanho,
                    tamanho === item && styles.selecionado,
                  ]}
                  onPress={() =>
                    setTamanho(tamanho === item ? "" : item)
                  }
                >
                  <Text
                    style={[
                      styles.textoTamanho,
                      tamanho === item &&
                        styles.textoSelecionado,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Valor da peça */}
          <View style={styles.secaoPreco}>
            <Text style={styles.rotulo}>Valor da Peça</Text>

            <View style={styles.linhaPrecos}>
              {precos.map((item, index) => (
                <View
                  key={item.valor}
                  style={styles.itemPreco}
                >
                  <Text style={styles.textoPreco}>
                    {item.texto}
                  </Text>

                  <TouchableOpacity
                    style={[
                      styles.circuloPreco,
                      preco === item.valor &&
                        styles.circuloSelecionado,
                    ]}
                    onPress={() => setPreco(item.valor)}
                    accessibilityLabel={`Selecionar ${item.texto}`}
                  />

                  {index < precos.length - 1 && (
                    <View style={styles.linhaPreco} />
                  )}
                </View>
              ))}
            </View>
          </View>

          {/* Marca */}
          <View style={styles.secaoCampo}>
            <Text style={styles.rotulo}>Marca</Text>

            <TouchableOpacity
              style={styles.seletor}
              onPress={() => abrirSeletor("marca")}
            >
              <Text
                style={[
                  styles.textoSeletor,
                  marca !== "Todas as Marcas" &&
                    styles.textoEscolhido,
                ]}
              >
                {marca}
              </Text>

              <Ionicons
                name="chevron-down"
                size={21}
                color="#111111"
              />
            </TouchableOpacity>
          </View>

          {/* Categoria */}
          <View style={styles.secaoCategoria}>
            <Text style={styles.rotulo}>Categoria</Text>

            <TouchableOpacity
              style={styles.seletor}
              onPress={() => abrirSeletor("categoria")}
            >
              <Text
                style={[
                  styles.textoSeletor,
                  categoria !== "Todas as Categorias" &&
                    styles.textoEscolhido,
                ]}
              >
                {categoria}
              </Text>

              <Ionicons
                name="chevron-down"
                size={21}
                color="#111111"
              />
            </TouchableOpacity>
          </View>

          {/* Botões */}
          <View style={styles.botoes}>
            <TouchableOpacity
              style={styles.botaoLimpar}
              onPress={limparFiltros}
            >
              <Text style={styles.textoBotaoLimpar}>
                LIMPAR FILTROS
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.botaoAplicar}
              onPress={aplicarFiltros}
            >
              <Text style={styles.textoBotaoAplicar}>
                APLICAR FILTROS
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Modal de seleção */}
        <Modal
          visible={seletorAberto}
          transparent
          animationType="fade"
          onRequestClose={() => setSeletorAberto(false)}
        >
          <TouchableOpacity
            style={styles.fundoModal}
            activeOpacity={1}
            onPress={() => setSeletorAberto(false)}
          >
            <View style={styles.modalConteudo}>
              <Text style={styles.tituloModal}>
                {tipoSeletor === "marca"
                  ? "Selecionar marca"
                  : "Selecionar categoria"}
              </Text>

              {opcoes.map((item) => {
                const selecionado =
                  tipoSeletor === "marca"
                    ? marca === item
                    : categoria === item;

                return (
                  <TouchableOpacity
                    key={item}
                    style={styles.opcaoModal}
                    onPress={() => {
                      if (tipoSeletor === "marca") {
                        setMarca(item);
                      } else {
                        setCategoria(item);
                      }

                      setSeletorAberto(false);
                    }}
                  >
                    <Text style={styles.textoOpcaoModal}>
                      {item}
                    </Text>

                    {selecionado && (
                      <Ionicons
                        name="checkmark"
                        size={20}
                        color="#111111"
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </TouchableOpacity>
        </Modal>
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
    height: 123,
    marginHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#AAAAAA",
    alignItems: "center",
    justifyContent: "center",
  },

  botaoMenu: {
    position: "absolute",
    right: 3,
    top: 29,
    width: 28,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  marcaLogo: {
    alignItems: "center",
    marginTop: 13,
  },

  nomeMarca: {
    fontSize: 29,
    fontWeight: "300",
    letterSpacing: 6,
    color: "#080808",
  },

  anoMarca: {
    fontSize: 11,
    color: "#111111",
    marginTop: 5,
  },

  conteudo: {
    flex: 1,
    paddingHorizontal: 28,
  },

  tituloPagina: {
    height: 65,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  botaoVoltar: {
    width: 30,
    alignItems: "flex-start",
    justifyContent: "center",
  },

  titulo: {
    fontSize: 20,
    fontWeight: "600",
    color: "#080808",
  },

  espacoTitulo: {
    width: 30,
  },

  rotulo: {
    fontSize: 16,
    fontWeight: "600",
    color: "#080808",
  },

  secaoTamanho: {
    marginTop: 9,
  },

  listaTamanhos: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 17,
    paddingHorizontal: 7,
  },

  botaoTamanho: {
    width: 44,
    height: 38,
    borderWidth: 1,
    borderColor: "#111111",
    borderRadius: 3,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },

  selecionado: {
    backgroundColor: "#000000",
  },

  textoTamanho: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111111",
  },

  textoSelecionado: {
    color: "#FFFFFF",
  },

  secaoPreco: {
    marginTop: 49,
  },

  linhaPrecos: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 35,
    height: 30,
  },

  itemPreco: {
    flex: 1,
    height: 30,
    alignItems: "center",
    justifyContent: "flex-end",
  },

  textoPreco: {
    position: "absolute",
    top: -19,
    fontSize: 10,
    fontWeight: "600",
    color: "#111111",
    textAlign: "center",
  },

  circuloPreco: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#111111",
    backgroundColor: "#FFFFFF",
    zIndex: 2,
  },

  circuloSelecionado: {
    backgroundColor: "#000000",
  },

  linhaPreco: {
    position: "absolute",
    height: 1,
    backgroundColor: "#111111",
    width: "100%",
    left: "50%",
    bottom: 9,
    zIndex: 1,
  },

  secaoCampo: {
    marginTop: 41,
  },

  secaoCategoria: {
    marginTop: 18,
  },

  seletor: {
    height: 52,
    borderWidth: 1,
    borderColor: "#111111",
    borderRadius: 3,
    marginTop: 16,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  textoSeletor: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111111",
  },

  textoEscolhido: {
    fontWeight: "500",
  },

  botoes: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 18,
    marginTop: 27,
    marginBottom: 30,
  },

  botaoLimpar: {
    flex: 1,
    height: 51,
    borderWidth: 1,
    borderColor: "#111111",
    borderRadius: 3,
    alignItems: "center",
    justifyContent: "center",
  },

  textoBotaoLimpar: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111111",
  },

  botaoAplicar: {
    flex: 1,
    height: 51,
    backgroundColor: "#000000",
    borderWidth: 1,
    borderColor: "#111111",
    borderRadius: 3,
    alignItems: "center",
    justifyContent: "center",
  },

  textoBotaoAplicar: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  fundoModal: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    paddingHorizontal: 25,
  },

  modalConteudo: {
    backgroundColor: "#FFFFFF",
    borderRadius: 4,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
    maxHeight: "80%",
  },

  tituloModal: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111111",
    marginBottom: 12,
  },

  opcaoModal: {
    minHeight: 47,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  textoOpcaoModal: {
    fontSize: 15,
    color: "#111111",
  },
});
