export default function StatCard({ label, valor, size = 'lg' }) {
  return (
    <div className={`card stat-card stat-card--${size}`}>
      <span className="stat-label">{label}</span>
      <strong className="stat-value">{valor}</strong>
    </div>
  );
}
