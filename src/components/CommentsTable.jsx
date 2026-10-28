import { useState } from 'react';
 
export default function CommentsTable({ comentarios, limite = 4 }) {
  const [verTodos, setVerTodos] = useState(false);
  const lista = verTodos ? comentarios : comentarios.slice(0, limite);
 
  return (
    <div className="comentarios">
      <h3>Comentários</h3>
      <div className="tabela-wrap">
        <table className="tabela">
          <thead>
            <tr>
              <th className="num">ID</th>
              <th className="num">Oficina</th>
              <th>Comentário</th>
            </tr>
          </thead>
          <tbody>
            {lista.length === 0 ? (
              <tr><td colSpan={3}>Nenhum comentário para esta oficina.</td></tr>
            ) : (
              lista.map((c, i) => (
                <tr key={`${c.id}-${i}`}>
                  <td className="num">{c.id}</td>
                  <td className="num">{c.oficina}</td>
                  <td>{c.texto}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
 
      {comentarios.length > limite && (
        <button type="button" className="ver-todos" onClick={() => setVerTodos(!verTodos)}>
          {verTodos ? 'Ver menos' : 'Ver todos os comentários'}
          <svg width="8" height="14" viewBox="0 0 8 14" aria-hidden="true"
               style={{ transform: verTodos ? 'rotate(-90deg)' : 'none' }}>
            <path d="M1 1l6 6-6 6" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
        </button>
      )}
    </div>
  );
}
