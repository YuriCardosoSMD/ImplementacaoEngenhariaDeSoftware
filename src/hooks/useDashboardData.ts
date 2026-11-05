import { useState, useEffect, useCallback } from 'react';
import {
  resumo as resumoInicial,
  origemParticipantes as origemInicial,
  filtrosAvaliacao as filtrosIniciais,
  comentarios as comentariosIniciais,
  type Avaliacao,
} from '../data/dados';
import { calcularEstatisticas, obterNivel } from '../utils/estatisticas';
import { buscarDadosDoForms, type DadosForms } from '../services/googleFormsService';

const DEFAULT_SHEET_CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ5zMtphOi_Xelj5wMo-H-w7YggO3jslwU9iBNCRdDNjRJDXdXJ8VwrWAsOPmAb16yQYhpYk5o8dtLn/pub?output=csv';

const SHEET_CSV_URL: string =
  import.meta.env.VITE_SHEET_CSV_URL || DEFAULT_SHEET_CSV_URL;

const DATA_OFICINA_STORAGE_KEY = 'ufc-comunidade:data-oficina';

export function useDashboardData() {
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

  const carregarDados = useCallback((ignorarCache = false) => {
    setCarregando(true);
    buscarDadosDoForms(SHEET_CSV_URL, ignorarCache)
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

  useEffect(() => {
    carregarDados(false);
  }, [carregarDados]);

  const recarregarDados = useCallback(() => {
    carregarDados(true);
  }, [carregarDados]);

  const atualizarParticipantesFiltro = useCallback(
    (valor: number) => {
      setParticipantesPorFiltro((atuais) => ({
        ...atuais,
        [String(filtro)]: valor,
      }));
    },
    [filtro]
  );

  const { resumo, origemParticipantes, filtrosAvaliacao, comentarios } = dados;

  const selecionado =
    filtrosAvaliacao.find((f) => f.id === filtro) ?? filtrosAvaliacao[0];
  const totalCalculadoParaFiltro = selecionado.notas.reduce(
    (total, quantidade) => total + quantidade,
    0
  );
  const totalParticipantes =
    participantesPorFiltro[String(filtro)] ??
    (filtro === 'geral' ? resumo.participantes : totalCalculadoParaFiltro);
  const quantidadeOficinas = filtro === 'geral' ? resumo.oficinas : 1;

  const { media, moda, mediana } = calcularEstatisticas(selecionado.notas);
  const nivel = obterNivel(media);

  const comentariosFiltrados =
    filtro === 'geral'
      ? comentarios
      : comentarios.filter((c) => c.oficina === filtro);

  const maiorOrigem = Math.max(...origemParticipantes.map((d) => d.valor), 0);
  const maxHorizontal = Math.max(25, Math.ceil(maiorOrigem / 5) * 5);

  const maiorNota = Math.max(...selecionado.notas, 0);
  const maxVertical = Math.max(20, Math.ceil(maiorNota / 5) * 5);

  return {
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
  };
}