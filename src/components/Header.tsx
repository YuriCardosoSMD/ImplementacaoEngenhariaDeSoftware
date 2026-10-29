import { useState, type ChangeEvent } from 'react';

interface HeaderProps {
  titulo: string;
  dataOficina: string;
  onDataOficinaChange: (data: string) => void;
}

const anoAtual = new Date().getFullYear();

export default function Header({
  titulo,
  dataOficina,
  onDataOficinaChange,
}: HeaderProps) {
  const [partes, setPartes] = useState(() => {
    const [ano = '', mes = '', dia = ''] = dataOficina.split('-');
    return { ano, mes, dia };
  });

  const handleDataChange = (part: 'ano' | 'mes' | 'dia') => (
    event: ChangeEvent<HTMLSelectElement>,
  ) => {
    const valores = { ...partes, [part]: event.target.value };
    setPartes(valores);
    onDataOficinaChange(
      valores.ano && valores.mes && valores.dia
        ? `${valores.ano}-${valores.mes}-${valores.dia}`
        : '',
    );
  };

  return (
    <header className="header">
      <h1>{titulo}</h1>
      <label className="data-oficina">
        <span>Data da oficina</span>
        <div className="data-selects">
          <select value={partes.dia} onChange={handleDataChange('dia')} aria-label="Dia da oficina">
            <option value="">Dia</option>
            {Array.from({ length: 31 }, (_, i) => {
              const valor = String(i + 1).padStart(2, '0');
              return <option key={valor} value={valor}>{i + 1}</option>;
            })}
          </select>
          <select value={partes.mes} onChange={handleDataChange('mes')} aria-label="Mês da oficina">
            <option value="">Mês</option>
            {Array.from({ length: 12 }, (_, i) => {
              const valor = String(i + 1).padStart(2, '0');
              return <option key={valor} value={valor}>{i + 1}</option>;
            })}
          </select>
          <select value={partes.ano} onChange={handleDataChange('ano')} aria-label="Ano da oficina">
            <option value="">Ano</option>
            {Array.from({ length: 11 }, (_, i) => {
              const valor = String(anoAtual - i);
              return <option key={valor} value={valor}>{valor}</option>;
            })}
          </select>
        </div>
      </label>
    </header>
  );
}