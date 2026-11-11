import Header from './components/Header';
import StatCard from './components/StatCard';
import HorizontalBarChart from './components/HorizontalBarChart';
import VerticalBarChart from './components/VerticalBarChart';
import WorkshopFilter from './components/WorkshopFilter';
import LevelCard from './components/LevelCard';
import CommentsTable from './components/CommentsTable';
import ParticipantesPage from './pages/ParticipantesPage';
import { formatar } from './utils/estatisticas';
import { useDashboardData } from './hooks/useDashboardData';
import { ROTAS, useHashRoute } from './hooks/useHashRoute';

export default function App() {
  const rota = useHashRoute();
  const {
    filtro,
    setFiltro,
    dataOficina,
    setDataOficina,
    carregando,
    erroConexao,
    recarregarDados,
    atualizarParticipantesFiltro,
    resumo,
    origemParticipantes,
    filtrosAvaliacao,
    selecionado,
    totalParticipantes,
    quantidadeOficinas,
    media,
    moda,
    mediana,
    nivel,
    comentariosFiltrados,
    maxHorizontal,
    maxVertical,
  } = useDashboardData();

  if (rota === 'participantes') {
    return <ParticipantesPage />;
  }

  return (
    <main className="dashboard">
      <Header
        titulo="UFC e a Comunidade"
        dataOficina={dataOficina}
        onDataOficinaChange={setDataOficina}
        onRecarregar={recarregarDados}
        carregando={carregando}
      />
      {carregando && <p>A atualizar dados das respostas...</p>}
      {erroConexao && (
        <div
          style={{
            padding: '16px 24px',
            background: 'rgba(255, 56, 60, 0.15)',
            border: '2px solid var(--red)',
            borderRadius: '12px',
            fontSize: '18px',
          }}
        >
          Não foi possível carregar a planilha: {erroConexao}
        </div>
      )}
      <div className="stats-wrap">
        <section className="stats">
          <StatCard
            label="Quantidade de participantes totais"
            valor={totalParticipantes}
            editavel
            onValorChange={atualizarParticipantesFiltro}
          />
          <StatCard label="Quantidade de oficinas" valor={quantidadeOficinas} />
          <StatCard label="Taxa de assiduidade" valor={resumo.assiduidade} />
        </section>
        <a href={ROTAS.participantes} className="ver-todos">
          Ver todos os participantes
          <svg width="8" height="14" viewBox="0 0 8 14" aria-hidden="true">
            <path d="M1 1l6 6-6 6" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
        </a>
      </div>
      <section className="section">
        <h2 className="section-title">Como conheceu o projeto?</h2>
        <HorizontalBarChart
          dados={origemParticipantes}
          max={maxHorizontal}
          passo={5}
        />
      </section>
      <section className="section">
        <h2 className="section-title">Avaliação</h2>
        <div className="avaliacao">
          <VerticalBarChart
            titulo={selecionado.nome}
            notas={selecionado.notas}
            max={maxVertical}
            passo={5}
          />
          <WorkshopFilter
            opcoes={filtrosAvaliacao}
            ativo={filtro}
            onChange={setFiltro}
          />
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
