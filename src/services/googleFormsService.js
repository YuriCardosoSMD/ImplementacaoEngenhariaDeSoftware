// src/services/googleFormsService.js

const CORES_ORIGEM = {
  WhatsApp: 'var(--green)',
  Instagram: 'var(--indigo)',
  Indicação: 'var(--mint)',
  Outros: 'var(--pink)',
};

const OFICINAS_PADRAO = [
  { id: 1, nome: 'Oficina 1 - Tema ABC' },
  { id: 2, nome: 'Oficina 2 - Tema DEF' },
  { id: 3, nome: 'Oficina 3 - Tema GHI' },
  { id: 4, nome: 'Oficina 4 - Tema JKL' },
];

function parseCSV(csvText) {
  const linhas = [];
  let linhaAtual = [];
  let campoAtual = '';
  let dentroDeAspas = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const prox = csvText[i + 1];

    if (char === '"' && dentroDeAspas && prox === '"') {
      campoAtual += '"';
      i++;
    } else if (char === '"') {
      dentroDeAspas = !dentroDeAspas;
    } else if (char === ',' && !dentroDeAspas) {
      linhaAtual.push(campoAtual.trim());
      campoAtual = '';
    } else if ((char === '\n' || (char === '\r' && prox === '\n')) && !dentroDeAspas) {
      if (char === '\r') i++;
      linhaAtual.push(campoAtual.trim());
      if (linhaAtual.some((c) => c !== '')) linhas.push(linhaAtual);
      linhaAtual = [];
      campoAtual = '';
    } else {
      campoAtual += char;
    }
  }
  if (campoAtual || linhaAtual.length > 0) {
    linhaAtual.push(campoAtual.trim());
    if (linhaAtual.some((c) => c !== '')) linhas.push(linhaAtual);
  }

  if (linhas.length <= 1) return [];
  const cabecalhos = linhas[0];

  return linhas.slice(1).map((valores, idx) => {
    const obj = { _linha: idx + 1 };
    cabecalhos.forEach((col, i) => {
      obj[col] = valores[i] ?? '';
    });
    return obj;
  });
}

function obterValorPorPalavraChave(registro, palavrasChave) {
  const chaves = Object.keys(registro);

  for (const palavra of palavrasChave) {
    const exata = chaves.find((k) => k.trim().toLowerCase() === palavra.toLowerCase());
    if (exata !== undefined && registro[exata] !== '') return registro[exata];
  }

  for (const palavra of palavrasChave) {
    const parcial = chaves.find((k) => k.toLowerCase().includes(palavra.toLowerCase()));
    if (parcial !== undefined && registro[parcial] !== '') return registro[parcial];
  }

  return '';
}

function identificarOficinaId(textoOficina, nomeAba = '') {
  const alvo = `${textoOficina} ${nomeAba}`;
  const match = alvo.match(/oficina\s*(\d+)/i) || alvo.match(/^(\d+)/);
  if (match) return Number(match[1]);
  return 1;
}

async function tentarBuscarRegistros(urls) {
  let ultimoErro = null;

  for (const url of urls) {
    if (!url) continue;
    try {
      const resposta = await fetch(url, { redirect: 'follow' });
      if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);

      const texto = (await resposta.text()).trim();

      // Se o Google devolveu uma página de login HTML em vez dos dados:
      if (texto.startsWith('<!DOCTYPE html>') || texto.startsWith('<html')) {
        throw new Error(
          'Permissão negada pelo Google ( retornou tela de login ). Verifique se a planilha está como "Qualquer pessoa com o link" ou se o Apps Script está aberto para "Qualquer pessoa".'
        );
      }

      const registros = texto.startsWith('[') ? JSON.parse(texto) : parseCSV(texto);
      return registros;
    } catch (err) {
      console.warn(`Tentativa falhou na URL (${url}):`, err.message);
      ultimoErro = err;
    }
  }

  throw ultimoErro || new Error('Não foi possível conectar ao Google Forms/Sheets.');
}

export async function buscarDadosDoForms(urls) {
  const listaUrls = Array.isArray(urls) ? urls : [urls];
  const registros = await tentarBuscarRegistros(listaUrls);

  const contagemOrigem = {
    WhatsApp: 0,
    Instagram: 0,
    Indicação: 0,
    Outros: 0,
  };

  const mapaOficinas = new Map(
    OFICINAS_PADRAO.map((o) => [o.id, { ...o, notas: [0, 0, 0, 0, 0] }])
  );

  const comentarios = [];
  const participantesIdentificados = new Set();
  let possuiCampoIdentificacao = false;

  registros.forEach((reg, index) => {
    const idAluno = obterValorPorPalavraChave(reg, [
      'matrícula',
      'matricula',
      'e-mail',
      'email',
      'endereço de e-mail',
      'nome',
    ]);

    if (idAluno) {
      possuiCampoIdentificacao = true;
      participantesIdentificados.add(String(idAluno).toLowerCase().trim());
    }

    const comoConheceu = String(
      obterValorPorPalavraChave(reg, ['Como conheceu o projeto?', 'como conheceu', 'origem'])
    ).trim();

    const oficinaResp = String(
      obterValorPorPalavraChave(reg, [
        'Qual oficina você está avaliando?',
        'qual oficina',
        'oficina avaliada',
        'tema',
      ])
    ).trim();

    const notaResp = Number(
      obterValorPorPalavraChave(reg, ['Nota da oficina', 'nota', 'avaliação', 'escala'])
    );

    const comentarioTexto = String(
      obterValorPorPalavraChave(reg, ['Comentário', 'comentario', 'sugestão', 'feedback'])
    ).trim();

    if (comoConheceu) {
      if (/whatsapp/i.test(comoConheceu)) contagemOrigem.WhatsApp++;
      else if (/instagram/i.test(comoConheceu)) contagemOrigem.Instagram++;
      else if (/indica/i.test(comoConheceu)) contagemOrigem.Indicação++;
      else contagemOrigem.Outros++;
    }

    const oficinaId = identificarOficinaId(oficinaResp, reg._aba);
    if (!mapaOficinas.has(oficinaId)) {
      mapaOficinas.set(oficinaId, {
        id: oficinaId,
        nome: oficinaResp || `Oficina ${oficinaId}`,
        notas: [0, 0, 0, 0, 0],
      });
    } else if (oficinaResp) {
      mapaOficinas.get(oficinaId).nome = oficinaResp;
    }

    if (notaResp >= 1 && notaResp <= 5) {
      mapaOficinas.get(oficinaId).notas[notaResp - 1]++;
    }

    if (comentarioTexto) {
      comentarios.push({
        id: String(index + 1).padStart(2, '0'),
        oficina: oficinaId,
        texto: comentarioTexto,
      });
    }
  });

  const oficinas = Array.from(mapaOficinas.values()).sort((a, b) => a.id - b.id);

  const notasGerais = oficinas.reduce(
    (acc, o) => acc.map((v, i) => v + o.notas[i]),
    [0, 0, 0, 0, 0]
  );

  const filtrosAvaliacao = [
    { id: 'geral', nome: 'Notas gerais', notas: notasGerais },
    ...oficinas,
  ];

  const origemParticipantes = Object.entries(contagemOrigem).map(([label, valor]) => ({
    label,
    valor,
    cor: CORES_ORIGEM[label],
  }));

  const respostasPorOficina = oficinas.map((o) => o.notas.reduce((a, b) => a + b, 0));
  const maxRespostasNumaOficina = Math.max(...respostasPorOficina, 0);

  const totalParticipantes = possuiCampoIdentificacao
    ? participantesIdentificados.size
    : registros.length;

  const baseParticipantesAssiduidade = possuiCampoIdentificacao
    ? participantesIdentificados.size
    : maxRespostasNumaOficina;

  const totalOficinas = oficinas.length;
  const assiduidadeCalculada =
    baseParticipantesAssiduidade > 0 && totalOficinas > 0
      ? `${Math.min(
          100,
          Math.round((registros.length / (baseParticipantesAssiduidade * totalOficinas)) * 100)
        )}%`
      : '0%';

  const resumo = {
    participantes: totalParticipantes,
    oficinas: totalOficinas,
    assiduidade: assiduidadeCalculada,
  };

  return {
    resumo,
    origemParticipantes,
    filtrosAvaliacao,
    comentarios,
  };
}