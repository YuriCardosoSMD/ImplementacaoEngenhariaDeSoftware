import { CORES_NOTAS } from '../data/dados';

interface VerticalBarChartProps {
  titulo: string;
  notas: number[];
  max: number;
  passo: number;
}

export default function VerticalBarChart({
  titulo,
  notas,
  max,
  passo,
}: VerticalBarChartProps) {
  const ticks = Array.from({ length: max / passo + 1 }, (_, i) => i * passo);

  return (
    <div
      className="card vbar"
      role="region"
      aria-label={`Distribuição de notas: ${titulo}`}
    >
      <span>{titulo}</span>
      <div className="vbar-cols" role="list" aria-label={`Notas de 1 a 5 para ${titulo}`}>
        <div className="vbar-col vbar-axis" aria-hidden="true">
          <span>QTD</span>
          <div className="vbar-ticks">
            {ticks.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </div>
        {notas.map((valor, i) => (
          <div
            className="vbar-col"
            key={i}
            role="listitem"
            aria-label={`Nota ${i + 1}: ${valor} avaliações`}
          >
            <span aria-hidden="true">{i + 1}</span>
            <div className="vbar-track" aria-hidden="true">
              <div
                className="bar bar--vertical"
                style={{
                  height: `${Math.min(valor / max, 1) * 100}%`,
                  background: CORES_NOTAS[i],
                }}
              >
                <span>{valor}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}