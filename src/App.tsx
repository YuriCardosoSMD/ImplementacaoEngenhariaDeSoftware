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
import type { DadosForms } from './services/googleFormsService';
import type { Avaliacao } from './data/dados';

// Cole aqui o link gerado em "Publicar na web" (.csv)
const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ5zMtphOi_Xelj5wMo-H-w7YggO3jslwU9iBNCRdDNjRJDXdXJ8VwrWAsOPmAb16yQYhpYk5o8dtLn/pub?output=csv';
const DATA_OFICINA_STORAGE_KEY = 'ufc-comunidade:data-oficina';

export default function App() {
  const [filtro, setFiltro] = useState<Avaliacao['id']>('geral');
  const [dataOficina, setDataOficina] = useState(() => {
    try {
      return window.localStorage.getItem(DATA_OFICINA_STORAGE_KEY) ?? '';
    } catch (erro: unknown) {
      console.error('Não foi possível recuperar a data da oficina salva:', erro);
      return '';
    }
  });
  const [participantesPorFiltro, setParticipantesPorFiltro] = useState<
    Partial<Record<string, number>>
  >({});
  const [dados, setDados] = useState<DadosForms>({
    resumo: resumoInicial,
    origemParticipantes: origemInicial,
    filtrosAvaliacao: filtrosIniciais,
    comentarios: comentariosIniciais,
  });
  const [carregando, setCarregando] = useState(true);
  const [erroConexao, setErroConexao] = useState<string | null>(null);

  useEffect(() => {
    try {
      if (dataOficina) {
        window.localStorage.setItem(DATA_OFICINA_STORAGE_KEY, dataOficina);
      } else {
        window.localStorage.removeItem(DATA_OFICINA_STORAGE_KEY);
      }
    } catch (erro: unknown) {
      console.error('Não foi possível salvar a data da oficina:', erro);
    }
  }, [dataOficina]);

  useEffect(() => {
    buscarDadosDoForms(SHEET_CSV_URL)
      .then((dadosPlanilha) => {
        setDados(dadosPlanilha);
        setParticipantesPorFiltro((atuais) => ({
          ...atuais,
          geral: dadosPlanilha.resumo.participantes,
        }));
        setErroConexao(null);
      })
      .catch((erro: unknown) => {
        console.error('Erro ao buscar respostas do Google Forms:', erro);
        setErroConexao(erro instanceof Error ? erro.message : String(erro));
      })
      .finally(() => {
        setCarregando(false);
      });
  }, []);

  const { resumo, origemParticipantes, filtrosAvaliacao, comentarios } = dados;

  const selecionado = filtrosAvaliacao.find((f) => f.id === filtro) ?? filtrosAvaliacao[0];
  const totalCalculadoParaFiltro = selecionado.notas.reduce((total, quantidade) => total + quantidade, 0);
  const totalParticipantes =
    participantesPorFiltro[String(filtro)] ??
    (filtro === 'geral' ? resumo.participantes : totalCalculadoParaFiltro);
  const quantidadeOficinas = filtro === 'geral' ? resumo.oficinas : 1;
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
      <Header
        titulo="UFC e a Comunidade"
        dataOficina={dataOficina}
        onDataOficinaChange={setDataOficina}
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

      <section className="stats">
        <StatCard
          label="Quantidade de participantes totais"
          valor={totalParticipantes}
          editavel
          onValorChange={(valor) => {
            setParticipantesPorFiltro((atuais) => ({
              ...atuais,
              [String(filtro)]: valor,
            }));
          }}
        />
        <StatCard label="Quantidade de oficinas" valor={quantidadeOficinas} />
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