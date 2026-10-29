interface StatCardProps {
  label: string;
  valor: string | number;
  size?: 'sm' | 'lg';
  editavel?: boolean;
  onValorChange?: (valor: number) => void;
}

export default function StatCard({
  label,
  valor,
  size = 'lg',
  editavel = false,
  onValorChange,
}: StatCardProps) {
  return (
    <div className={`card stat-card stat-card--${size}`}>
      <span className="stat-label">
        {label}
      </span>
      {editavel ? (
        <input
          className="stat-value stat-value-input"
          type="number"
          min="0"
          step="1"
          value={valor}
          onChange={(event) => onValorChange?.(Math.max(0, Number(event.target.value)))}
          aria-label={`${label} — informe o total`}
        />
      ) : (
        <strong className="stat-value">{valor}</strong>
      )}
    </div>
  );
}
