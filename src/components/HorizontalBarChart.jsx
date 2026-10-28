export default function HorizontalBarChart({ dados, max, passo }) {
  const ticks = Array.from({ length: max / passo + 1 }, (_, i) => i * passo);
 
  return (
    <div className="card hbar">
      {dados.map((d) => (
        <div className="hbar-row" key={d.label}>
          <span className="hbar-label">{d.label}</span>
          <div>
            <div className="bar" style={{ width: `${(d.valor / max) * 100}%`, background: d.cor }}>
              <span>{d.valor}</span>
            </div>
          </div>
        </div>
      ))}
 
      <div className="hbar-row">
        <span />
        <div className="hbar-ticks">
          {ticks.map((t) => <span key={t}>{t}</span>)}
        </div>
      </div>
    </div>
  );
}
