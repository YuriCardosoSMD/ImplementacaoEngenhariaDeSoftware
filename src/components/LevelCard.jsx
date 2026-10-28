import { formatar } from '../utils/estatisticas';
 
export default function LevelCard({ nivel }) {
  return (
    <div className="nivel" style={{ background: nivel.cor }} aria-live="polite">
      <span className="nivel-label">Nível</span>
      <strong className="nivel-valor">{formatar(nivel.valor)}</strong>
      <span className="nivel-rotulo">{nivel.rotulo}</span>
    </div>
  );
}
