export default function WorkshopFilter({ opcoes, ativo, onChange }) {
  return (
    <div className="filtro" role="group" aria-label="Filtrar avaliação por oficina">
      {opcoes.map((op) => (
        <button
          key={op.id}
          type="button"
          className={`filtro-btn ${ativo === op.id ? 'ativo' : ''}`}
          aria-pressed={ativo === op.id}
          onClick={() => onChange(op.id)}
        >
          {op.nome}
        </button>
      ))}
    </div>
  );
}
