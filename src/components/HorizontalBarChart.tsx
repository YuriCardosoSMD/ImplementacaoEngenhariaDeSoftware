import type { OrigemParticipante } from '../data/dados';

interface HorizontalBarChartProps {
  dados: OrigemParticipante[];
  max: number;
  passo: number;
}

export default function HorizontalBarChart({
  dados,
  max,
  passo,
}: HorizontalBarChartProps) {
  const ticks = Array.from({ length: max / passo + 1 }, (_, i) => i * passo);

  return (
    <div className="card hbar" role="list" aria-label="Origem dos participantes">
      {dados.map((d) => (
        <div
          className="hbar-row"
          key={d.label}
          role="listitem"
          aria-label={`${d.label}: ${d.valor} participantes`}
        >
          <span className="hbar-label" aria-hidden="true">
            {d.label}
          </span>
          <div aria-hidden="true">
            <div
              className="bar"
              style={{ width: `${(d.valor / max) * 100}%`, background: d.cor }}
            >
              <span>{d.valor}</span>
            </div>
          </div>
        </div>
      ))}
      <div className="hbar-row" aria-hidden="true">
        <span />
        <div className="hbar-ticks">
          {ticks.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}