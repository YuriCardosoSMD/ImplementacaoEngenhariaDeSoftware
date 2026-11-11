import { useEffect, useRef } from 'react';
import ParticipantsTable from '../components/ParticipantsTable';
import { PARTICIPANTES_EXEMPLO, type Participante } from '../data/participantes';
import { useComentariosBolsista } from '../hooks/useComentariosBolsista';
import { ROTAS } from '../hooks/useHashRoute';

interface ParticipantesPageProps {
  participantes?: Participante[];
}

export default function ParticipantesPage({
  participantes = PARTICIPANTES_EXEMPLO,
}: ParticipantesPageProps) {
  const tituloRef = useRef<HTMLHeadingElement>(null);

  const iniciais = Object.fromEntries(
    participantes.filter((p) => p.comentario).map((p) => [p.id, p.comentario ?? ''])
  );
  const { comentarios, salvarComentario } = useComentariosBolsista(iniciais);

  // Leva o foco ao título ao abrir a página (ajuda leitores de tela).
  useEffect(() => {
    tituloRef.current?.focus();
  }, []);

  return (
    <main className="dashboard pagina-participantes">
      <header className="pagina-header">
        <a href={ROTAS.painel} className="voltar" aria-label="Voltar para o painel">
          <svg width="14" height="24" viewBox="0 0 14 24" aria-hidden="true">
            <path d="M12 2L2 12l10 10" stroke="currentColor" strokeWidth="3"
                  fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
        <h1 ref={tituloRef} tabIndex={-1}>Adicionar comentários por participantes</h1>
      </header>

      <ParticipantsTable
        participantes={participantes}
        comentarios={comentarios}
        onComentarioChange={salvarComentario}
      />
    </main>
  );
}
