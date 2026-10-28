import { useState, useEffect } from 'react';
import Header from './components/Header';
import StatCard from './components/StatCard';
import HorizontalBarChart from './components/HorizontalBarChart';
import VerticalBarChart from './components/VerticalBarChart';
import WorkshopFilter from './components/WorkshopFilter';
import LevelCard from './components/LevelCard';
import CommentsTable from './components/CommentsTable';
import {
  resumo as resumoInicial,
  origemParticipantes as origemInicial,
  filtrosAvaliacao as filtrosIniciais,
  comentarios as comentariosIniciais,
} from './data/dados';
import { calcularEstatisticas, obterNivel, formatar } from './utils/estatisticas';
import { buscarDadosDoForms } from './services/googleFormsService';

// Cole aqui o link gerado em "Publicar na web" (.csv)
const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ5zMtphOi_Xelj5wMo-H-w7YggO3jslwU9iBNCRdDNjRJDXdXJ8VwrWAsOPmAb16yQYhpYk5o8dtLn/pub?output=csv';

export default function App() {
  const [filtro, setFiltro] = useState('geral');
  const [dados, setDados] = useState({
    resumo: resumoInicial,
    origemParticipantes: origemInicial,
    filtrosAvaliacao: filtrosIniciais,
    comentarios: comentariosIniciais,
  });
  const [carregando, setCarregando] = useState(true);
  const [erroConexao, setErroConexao] = useState(null);

  useEffect(() => {
    buscarDadosDoForms(SHEET_CSV_URL)
      .then((dadosPlanilha) => {
        setDados(dadosPlanilha);
        setErroConexao(null);
      })
      .catch((erro) => {
        console.error('Erro ao buscar respostas do Google Forms:', erro);
        setErroConexao(erro.message);
      })
      .finally(() => {
        setCarregando(false);
      });
  }, []);

  const { resumo, origemParticipantes, filtrosAvaliacao, comentarios } = dados;

  const selecionado = filtrosAvaliacao.find((f) => f.id === filtro) || filtrosAvaliacao[0];
  const { media, moda, mediana } = calcularEstatisticas(selecionado.notas);
  const nivel = obterNivel(media);
  const comentariosFiltrados =
    filtro === 'geral' ? comentarios : comentarios.filter((c) => c.oficina === filtro);

  const maiorOrigem = Math.max(...origemParticipantes.map((d) => d.valor), 0);
  const maxHorizontal = Math.max(25, Math.ceil(maiorOrigem / 5) * 5);

  const maiorNota = Math.max(...selecionado.notas, 0);
  const maxVertical = Math.max(20, Math.ceil(maiorNota / 5) * 5);

  return (
    <main className="dashboard">
      <Header titulo="UFC e a Comunidade" periodo="2026.1" />

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

      <section className="stats">
        <StatCard label="Quantidade de participantes totais" valor={resumo.participantes} />
        <StatCard label="Quantidade de oficinas" valor={resumo.oficinas} />
        <StatCard label="Taxa de assiduidade" valor={resumo.assiduidade} />
      </section>

      <section className="section">
        <h2 className="section-title">Como conheceu o projeto?</h2>
        <HorizontalBarChart dados={origemParticipantes} max={maxHorizontal} passo={5} />
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