import { useState, useEffect } from 'react';

let listaFavoritos: string[] = ['7', '8', '9', '10'];

const ouvintes = new Set<(lista: string[]) => void>();

function atualizarFavoritos(novaLista: string[]) {
  listaFavoritos = novaLista;

  ouvintes.forEach((ouvinte) => ouvinte([...listaFavoritos]));
}

export function useFavoritos() {
  const [favoritos, setFavoritos] = useState<string[]>([
    ...listaFavoritos,
  ]);

  useEffect(() => {
    ouvintes.add(setFavoritos);

    return () => {
      ouvintes.delete(setFavoritos);
    };
  }, []);

  function alternarFavorito(id: string) {
    if (listaFavoritos.includes(id)) {
      atualizarFavoritos(
        listaFavoritos.filter((item) => item !== id)
      );
    } else {
      atualizarFavoritos([...listaFavoritos, id]);
    }
  }

  function verificarFavorito(id: string) {
    return favoritos.includes(id);
  }

  return {
    favoritos,
    alternarFavorito,
    verificarFavorito,
  };
}