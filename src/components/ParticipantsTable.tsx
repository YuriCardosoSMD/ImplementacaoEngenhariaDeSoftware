import { useEffect, useState } from 'react';
import type { Participante } from '../data/participantes';
import type { ComentariosBolsista } from '../hooks/useComentariosBolsista';

interface ParticipantsTableProps {
  participantes: Participante[];
  comentarios: ComentariosBolsista;
  onComentarioChange: (id: string, texto: string) => void;
  limite?: number;
}

interface ComentarioCellProps {
  participante: Participante;
  valor: string;
  onSalvar: (id: string, texto: string) => void;
}

function ComentarioCell({ participante, valor, onSalvar }: ComentarioCellProps) {
  const [rascunho, setRascunho] = useState(valor);

  useEffect(() => {
    setRascunho(valor);
  }, [valor]);

  return (
    <textarea
      className="comentario-input"
      value={rascunho}
      rows={3}
      placeholder="Adicionar comentário..."
      aria-label={`Comentário do bolsista sobre ${participante.nome}`}
      onChange={(event) => setRascunho(event.target.value)}
      onBlur={() => onSalvar(participante.id, rascunho)}
    />
  );
}

export default function ParticipantsTable({
  participantes,
  comentarios,
  onComentarioChange,
  limite = 4,
}: ParticipantsTableProps) {
  const [mostrarTodos, setMostrarTodos] = useState(true);
  const [verTodos, setVerTodos] = useState(false);

  const filtrados = mostrarTodos
    ? participantes
    : participantes.filter((p) => !comentarios[p.id]);
  const lista = verTodos ? filtrados : filtrados.slice(0, limite);

  return (
    <div className="participantes">
      <div className="part-tabela-wrap">
        <table className="part-tabela">
          <thead>
            <tr>
              <th scope="col" className="part-nome">Participante</th>
              <th scope="col" className="part-oficina">Oficina</th>
              <th scope="col">
                <div className="part-th-comentario">
                  <span>Comentário do bolsista</span>
                  <label className="switch">
                    <span className="switch-label">Todos</span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={mostrarTodos}
                      aria-label="Mostrar todos os participantes (desligado: apenas sem comentário)"
                      className={`switch-track ${mostrarTodos ? 'ligado' : ''}`}
                      onClick={() => setMostrarTodos(!mostrarTodos)}
                    >
                      <span className="switch-thumb" aria-hidden="true" />
                    </button>
                  </label>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {lista.length === 0 ? (
              <tr>
                <td colSpan={3} className="part-vazio">
                  {mostrarTodos
                    ? 'Nenhum participante encontrado.'
                    : 'Todos os participantes já possuem comentário.'}
                </td>
              </tr>
            ) : (
              lista.map((p) => (
                <tr key={p.id}>
                  <th scope="row" className="part-nome">{p.nome}</th>
                  <td className="part-oficina">{p.oficina}</td>
                  <td>
                    <ComentarioCell
                      participante={p}
                      valor={comentarios[p.id] ?? ''}
                      onSalvar={onComentarioChange}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {filtrados.length > limite && (
        <button
          type="button"
          className="ver-todos ver-todos--lg"
          aria-expanded={verTodos}
          onClick={() => setVerTodos(!verTodos)}
        >
          {verTodos ? 'Ver menos' : 'Ver todos os participantes'}
          <svg width="8" height="14" viewBox="0 0 8 14" aria-hidden="true"
               style={{ transform: verTodos ? 'rotate(-90deg)' : 'none' }}>
            <path d="M1 1l6 6-6 6" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
        </button>
      )}
    </div>
  );
}
