# 📊 Dashboard "UFC e a Comunidade"

Um sistema digital centralizado para controle de frequência, avaliação e acompanhamento das oficinas do projeto de extensão universitária **UFC e a Comunidade**, promovido pelo curso de Sistemas e Mídias Digitais (SMD) da Universidade Federal do Ceará.

## 🎯 O Desafio e a Solução

**O Problema:** A gestão de frequência das oficinas dependia de registros descentralizados e manuais em papel. A falta de formalização dificultava a obtenção de dados precisos, resultando na perda de rastreabilidade de justificativas para a evasão escolar. Historicamente, turmas de 30 inscritos finalizavam com cerca de 10 participantes.

**A Solução:** Para apoiar coordenadores (administradores) e alunos bolsistas (operadores), foi desenvolvido um painel visual (Dashboard) integrado diretamente ao ecossistema do Google.

O sistema permite o cruzamento de informações em tempo real e fornece acesso ao feedback dos cursistas, possibilitando **ações proativas de retenção**, como contatos direcionados via WhatsApp para alunos faltosos.

## ✨ Funcionalidades Principais

- **Integração Serverless:** Consumo direto de dados publicados via CSV do Google Sheets, alimentado pelo Google Forms, eliminando a necessidade de um backend dedicado para um MVP sustentável.

- **Parsing Nativo:** Leitura e categorização de dados em formato CSV construída puramente com JavaScript/TypeScript, sem dependência de bibliotecas externas.

- **Sistema de Cache Inteligente:** Utilização de `sessionStorage` com TTL (Time-To-Live) de 5 minutos e mecanismo de *cache-busting* para otimizar requisições e evitar limites de taxa da API do Google.

- **Métricas em Tempo Real:** Cálculo instantâneo de assiduidade, média, moda e mediana das avaliações das oficinas.

- **Interface Acessível e Responsiva:** Gráficos nativos e responsivos construídos com HTML/CSS, com suporte a atributos ARIA para leitores de tela, adaptando-se a celulares, tablets e desktops.

## 🛠️ Tecnologias Utilizadas

- **[React 19](https://react.dev/)** - Biblioteca principal para construção da interface.
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática para maior segurança e previsibilidade do código.
- **[Vite](https://vitejs.dev/)** - Bundler para desenvolvimento e geração da build.
- **CSS3** - Estilização modular via CSS puro, utilizando um sistema de variáveis para garantir consistência visual.

## 🚀 Como executar o projeto localmente

### 1. Pré-requisitos

Certifique-se de ter o [Node.js](https://nodejs.org/) instalado na sua máquina.

### 2. Clonando o repositório

```bash
git clone https://github.com/seu-usuario/ufc-comunidade.git
cd ufc-comunidade
```

> Substitua `seu-usuario` pelo usuário ou organização responsável pelo repositório no GitHub.

### 3. Configurando as Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto e adicione a URL pública do CSV gerado pelo Google Sheets:

```env
VITE_SHEET_CSV_URL=sua_url_do_google_sheets_aqui
```

> **Nota:** O projeto possui uma URL padrão de fallback caso a variável não seja preenchida, útil para testes rápidos.

### 4. Instalando as dependências

```bash
npm install
```

### 5. Rodando a aplicação

```bash
npm run dev
```

O servidor de desenvolvimento será iniciado. Acesse o endereço local indicado no terminal, geralmente:

[http://localhost:5173](http://localhost:5173)

## 📋 Scripts Disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento. |
| `npm run build` | Gera a versão otimizada para produção. |
| `npm run preview` | Inicia um servidor local para testar a build de produção. |
| `npm run typecheck` | Verifica a tipagem do projeto. |
| `npm run lint` | Executa a análise estática de código com Oxlint. |

---

Feito com 💡 por **Yuri Cardoso**
