export const resumo = {
  participantes: 15,
  oficinas: 4,
  assiduidade: '50%',
};
 
export const origemParticipantes = [
  { label: 'WhatsApp', valor: 10, cor: 'var(--green)' },
  { label: 'Instagram', valor: 3, cor: 'var(--indigo)' },
  { label: 'Indicação', valor: 2, cor: 'var(--mint)' },
  { label: 'Outros', valor: 1, cor: 'var(--pink)' },
];
 
// Cores das notas 1 a 5
export const CORES_NOTAS = ['var(--red)', 'var(--orange)', 'var(--yellow)', 'var(--green)', 'var(--cyan)'];
 
// notas = quantidade de pessoas que deram nota 1, 2, 3, 4 e 5
export const oficinas = [
  { id: 1, nome: 'Oficina 1 - Tema ABC', notas: [2, 1, 0, 0, 3] },
  { id: 2, nome: 'Oficina 2 - Tema DEF', notas: [1, 1, 1, 0, 2] },
  { id: 3, nome: 'Oficina 3 - Tema GHI', notas: [1, 0, 1, 1, 2] },
  { id: 4, nome: 'Oficina 4 - Tema JKL', notas: [1, 1, 0, 0, 3] },
];
 
// "Notas gerais" = soma de todas as oficinas
const notasGerais = oficinas.reduce(
  (acc, o) => acc.map((v, i) => v + o.notas[i]),
  [0, 0, 0, 0, 0]
);
 
export const filtrosAvaliacao = [
  { id: 'geral', nome: 'Notas gerais', notas: notasGerais },
  ...oficinas,
];
 
const lorem =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
 
export const comentarios = [
  { id: '01', oficina: 1, texto: lorem },
  { id: '12', oficina: 2, texto: lorem },
  { id: '12', oficina: 3, texto: lorem },
  { id: '15', oficina: 4, texto: lorem },
  { id: '07', oficina: 1, texto: lorem },
  { id: '09', oficina: 2, texto: lorem },
];
