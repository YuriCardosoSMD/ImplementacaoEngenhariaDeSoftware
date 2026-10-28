import { useState } from 'react';
import Header from './components/Header';
import StatCard from './components/StatCard';
import HorizontalBarChart from './components/HorizontalBarChart';
import VerticalBarChart from './components/VerticalBarChart';
import WorkshopFilter from './components/WorkshopFilter';
import LevelCard from './components/LevelCard';
import CommentsTable from './components/CommentsTable';
import { resumo, origemParticipantes, filtrosAvaliacao, comentarios } from './data/dados';
import { calcularEstatisticas, obterNivel, formatar } from './utils/estatisticas';
 
export default function App() {
  const [filtro, setFiltro] = useState('geral');
 
  const selecionado = filtrosAvaliacao.find((f) => f.id === filtro);
  const { media, moda, mediana } = calcularEstatisticas(selecionado.notas);
  const nivel = obterNivel(media);
 
  const comentariosFiltrados =
    filtro === 'geral' ? comentarios : comentarios.filter((c) => c.oficina === filtro);
 
  return (
    <main className="dashboard">
      <Header titulo="UFC e a Comunidade" periodo="2026.1" />
 
      <section className="stats">
        <StatCard label="Quantidade de participantes totais" valor={resumo.participantes} />
        <StatCard label="Quantidade de oficinas" valor={resumo.oficinas} />
        <StatCard label="Taxa de assiduidade" valor={resumo.assiduidade} />
      </section>
 
      <section className="section">
        <h2 className="section-title">Como conheceu o projeto?</h2>
        <HorizontalBarChart dados={origemParticipantes} max={25} passo={5} />
      </section>
 
      <section className="section">
        <h2 className="section-title">Avaliação</h2>
 
        <div className="avaliacao">
          <VerticalBarChart titulo={selecionado.nome} notas={selecionado.notas} max={20} passo={5} />
          <WorkshopFilter opcoes={filtrosAvaliacao} ativo={filtro} onChange={setFiltro} />
        </div>
 
        <div className="estatisticas">
          <StatCard size="sm" label="Média" valor={formatar(media)} />
          <StatCard size="sm" label="Moda" valor={formatar(moda)} />
          <StatCard size="sm" label="Mediana" valor={formatar(mediana)} />
        </div>
 
        <LevelCard nivel={nivel} />
        <CommentsTable comentarios={comentariosFiltrados} />
      </section>
    </main>
  );
}
