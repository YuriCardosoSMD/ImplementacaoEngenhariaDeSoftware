import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'ufc-comunidade:comentarios-bolsista';

export type ComentariosBolsista = Record<string, string>;

function carregar(): ComentariosBolsista {
  try {
    const salvo = window.localStorage.getItem(STORAGE_KEY);
    const dados: unknown = salvo ? JSON.parse(salvo) : {};
    return dados && typeof dados === 'object' ? (dados as ComentariosBolsista) : {};
  } catch (erro) {
    console.error('Não foi possível recuperar os comentários do bolsista:', erro);
    return {};
  }
}

/**
 * Guarda os comentários do bolsista por participante (chave = id do participante)
 * no localStorage do navegador.
 */
export function useComentariosBolsista(iniciais: ComentariosBolsista = {}) {
  const [comentarios, setComentarios] = useState<ComentariosBolsista>(() => ({
    ...iniciais,
    ...carregar(),
  }));

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(comentarios));
    } catch (erro) {
      console.error('Não foi possível salvar os comentários do bolsista:', erro);
    }
  }, [comentarios]);

  const salvarComentario = useCallback((id: string, texto: string) => {
    setComentarios((atual) => {
      const limpo = texto.trim();
      if ((atual[id] ?? '') === limpo) return atual;
      // Mantém a chave mesmo vazia para que um comentário apagado
      // não volte a aparecer a partir dos dados iniciais.
      return { ...atual, [id]: limpo };
    });
  }, []);

  return { comentarios, salvarComentario };
}
