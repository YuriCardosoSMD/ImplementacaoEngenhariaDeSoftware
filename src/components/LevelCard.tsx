import { formatar } from '../utils/estatisticas';
import type { Nivel } from '../utils/estatisticas';
 
interface LevelCardProps {
  nivel: Nivel;
}

export default function LevelCard({ nivel }: LevelCardProps) {
  return (
    <div className="nivel" style={{ background: nivel.cor }} aria-live="polite">
      <span className="nivel-label">Nível</span>
      <strong className="nivel-valor">{formatar(nivel.valor)}</strong>
      <span className="nivel-rotulo">{nivel.rotulo}</span>
    </div>
  );
}
