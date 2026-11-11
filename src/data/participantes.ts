export interface Participante {
  id: string;
  nome: string;
  oficina: number;
  /** Comentário inicial (opcional). Edições do bolsista ficam no localStorage. */
  comentario?: string;
}

const LOREM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';

/**
 * Dados de exemplo para a página de participantes.
 * Substitua pela lista real (ex.: vinda da planilha) quando disponível.
 */
export const PARTICIPANTES_EXEMPLO: Participante[] = [
  { id: 'p01', nome: 'Maria da Silva Moura', oficina: 1, comentario: LOREM },
  { id: 'p02', nome: 'Ana Clara Nogueira', oficina: 1, comentario: LOREM },
  { id: 'p03', nome: 'Mario de Jesus Mourão', oficina: 1 },
  { id: 'p04', nome: 'João Batista Barros de Freitas da Silva', oficina: 4 },
  { id: 'p05', nome: 'Francisca Lima Rocha', oficina: 2 },
  { id: 'p06', nome: 'Pedro Henrique Sales', oficina: 3, comentario: LOREM },
  { id: 'p07', nome: 'Luiza Fernandes Pinto', oficina: 3 },
];
