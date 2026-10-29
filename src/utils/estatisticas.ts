// Faixas do "Frame 323" do Figma (escala de 0 a 10)
const NIVEIS = [
  { min: 9, rotulo: 'Muito bom', cor: 'rgba(0, 192, 232, 0.6)' },
  { min: 7, rotulo: 'Bom', cor: 'rgba(52, 199, 89, 0.6)' },
  { min: 5, rotulo: 'Mediano', cor: 'rgba(255, 204, 0, 0.6)' },
  { min: 3, rotulo: 'Ruim', cor: 'rgba(255, 141, 40, 0.6)' },
  { min: 0, rotulo: 'Muito ruim', cor: 'rgba(255, 56, 60, 0.6)' },
];
 
export function calcularEstatisticas(notas: number[]): Estatisticas {
  const total = notas.reduce((a, b) => a + b, 0);
  if (total === 0) return { media: null, moda: null, mediana: null };
 
  const soma = notas.reduce((acc, qtd, i) => acc + qtd * (i + 1), 0);
  const media = soma / total;
 
  const maior = Math.max(...notas);
  const moda = notas.indexOf(maior) + 1;
 
  const notaNaPosicao = (pos: number): number | null => {
    let acumulado = 0;
    for (let i = 0; i < notas.length; i++) {
      acumulado += notas[i];
      if (acumulado >= pos) return i + 1;
    }
    return null;
  };
 
  const mediana =
    total % 2 === 1
      ? notaNaPosicao((total + 1) / 2)
      : ((notaNaPosicao(total / 2) ?? 0) + (notaNaPosicao(total / 2 + 1) ?? 0)) / 2;
 
  return { media, moda, mediana };
}
 
// Converte a média (1 a 5) para a escala de 0 a 10
export function obterNivel(media: number | null): Nivel {
  if (media == null) return { valor: null, rotulo: 'Sem dados', cor: 'var(--bg-grouped)' };
  const valor = media * 2;
  const faixa = NIVEIS.find((f) => valor >= f.min);
  return { valor, ...(faixa ?? NIVEIS[NIVEIS.length - 1]) };
}
 
export function formatar(numero: number | null) {
  if (numero == null || Number.isNaN(numero)) return '–';
  return numero.toLocaleString('pt-BR', { maximumFractionDigits: 1 });
}
export interface Estatisticas {
  media: number | null;
  moda: number | null;
  mediana: number | null;
}

export interface Nivel {
  valor: number | null;
  rotulo: string;
  cor: string;
}
