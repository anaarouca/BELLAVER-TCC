import AsyncStorage from "@react-native-async-storage/async-storage";

const CHAVE_FILTROS_PESQUISA = "@bellaver/filtros-pesquisa";

export type FiltrosPesquisa = {
  tamanho: string | null;
  preco: number | null;
  categoria: string;
};

function validarFiltros(valor: unknown): valor is FiltrosPesquisa {
  if (!valor || typeof valor !== "object") {
    return false;
  }

  const filtros = valor as Record<string, unknown>;
  return (
    (typeof filtros.tamanho === "string" || filtros.tamanho === null) &&
    (filtros.preco === null ||
      (typeof filtros.preco === "number" &&
        Number.isInteger(filtros.preco) &&
        filtros.preco >= 0 &&
        filtros.preco <= 4)) &&
    typeof filtros.categoria === "string"
  );
}

export async function salvarFiltrosPesquisa(
  filtros: FiltrosPesquisa
): Promise<void> {
  await AsyncStorage.setItem(CHAVE_FILTROS_PESQUISA, JSON.stringify(filtros));
}

export async function consumirFiltrosPesquisa(): Promise<FiltrosPesquisa | null> {
  const dados = await AsyncStorage.getItem(CHAVE_FILTROS_PESQUISA);
  if (!dados) {
    return null;
  }

  let filtros: unknown;
  try {
    filtros = JSON.parse(dados);
  } catch {
    await AsyncStorage.removeItem(CHAVE_FILTROS_PESQUISA);
    throw new Error("Os filtros salvos estão em um formato inválido.");
  }

  if (!validarFiltros(filtros)) {
    await AsyncStorage.removeItem(CHAVE_FILTROS_PESQUISA);
    throw new Error("Os filtros salvos estão em um formato inválido.");
  }

  await AsyncStorage.removeItem(CHAVE_FILTROS_PESQUISA);
  return filtros;
}
