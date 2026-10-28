import { CORES_NOTAS } from '../data/dados';
 
export default function VerticalBarChart({ titulo, notas, max, passo }) {
  const ticks = Array.from({ length: max / passo + 1 }, (_, i) => i * passo);
 
  return (
    <div className="card vbar">
      <span>{titulo}</span>
      <div className="vbar-cols">
        <div className="vbar-col vbar-axis">
          <span>QTD</span>
          <div className="vbar-ticks">
            {ticks.map((t) => <span key={t}>{t}</span>)}
          </div>
        </div>
 
        {notas.map((valor, i) => (
          <div className="vbar-col" key={i}>
            <span>{i + 1}</span>
            <div className="vbar-track">
              <div
                className="bar bar--vertical"
                style={{ height: `${Math.min(valor / max, 1) * 100}%`, background: CORES_NOTAS[i] }}
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
