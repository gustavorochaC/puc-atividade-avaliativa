Nome: Gustavo Rocha Silva Carvalho
Projeto Integrador

# Documentacao Completa do Projeto

Sistema Gerenciador de Tarefas

Gerado em: 03/04/2026

---

## 1. Resumo executivo

Este projeto entrega um MVP academico de gerenciamento de tarefas e projetos com autenticacao local, dashboard executivo, cadastro e edicao de projetos, cadastro e edicao de tarefas, quadro Kanban, calendario de entregas, modo claro e escuro e persistencia integral no navegador.

O sistema foi desenvolvido como uma aplicacao web com Next.js 16, React 19 e TypeScript. Toda a logica de estado da versao atual fica no frontend, centralizada em um provider global e persistida em `localStorage`.

O repositorio ja contem documentacao parcial em `README.md`. Este arquivo consolida a documentacao funcional e tecnica em um unico documento.

---

## 2. Objetivo do sistema

O objetivo do app e permitir que uma equipe organize demandas em um fluxo simples e visual:

- autenticar usuarios localmente
- cadastrar novos usuarios
- criar projetos com prazo e membros
- criar tarefas com status, prioridade, prazo e responsavel
- acompanhar tarefas em um dashboard executivo
- mover tarefas em um Kanban
- visualizar entregas em calendario

O foco do projeto e demonstracao academica com cara de produto real, mantendo uma implementacao enxuta e facil de executar.

---

## 3. Escopo funcional

As capacidades efetivamente implementadas no codigo atual sao:

- login com usuario demo e cadastro local
- redirecionamento automatico entre rotas publicas e privadas
- persistencia de sessao apos recarregar a pagina
- dashboard com indicadores, grafico por status, tabela de tarefas recentes e painel de prioridades
- criacao e edicao de projetos por modal
- criacao e edicao de tarefas por modal
- associacao de tarefas a projetos e usuarios
- calculo de progresso por projeto
- Kanban com filtro por projeto
- Kanban com drag-and-drop e tambem com botoes para avancar ou voltar status
- calendario mensal com destaque visual para dias com tarefas
- listagem de tarefas do dia selecionado
- painel com proximos prazos
- alternancia de tema `light`, `dark` e `system`

---

## 4. Stack tecnologica

### 4.1 Framework e runtime

- `next` `16.2.2`
- `react` `19.2.4`
- `react-dom` `19.2.4`
- `typescript` `5`

### 4.2 UI e estilo

- `tailwindcss` `4`
- `@tailwindcss/postcss` `4`
- `shadcn` `4.1.2`
- `radix-ui` `1.4.3`
- `next-themes` `0.4.6`
- `lucide-react` `1.7.0`
- `tw-animate-css` `1.4.0`
- `class-variance-authority` `0.7.1`
- `clsx` `2.1.1`
- `tailwind-merge` `3.5.0`

### 4.3 Dados, datas e feedback visual

- `date-fns` `4.1.0`
- `react-day-picker` `9.14.0`
- `recharts` `3.8.0`
- `sonner` `2.0.7`

### 4.4 Qualidade e build

- `eslint` `9`
- `eslint-config-next` `16.2.2`

---

## 5. Arquitetura da aplicacao

### 5.1 Visao geral

O projeto usa App Router e separa o fluxo em duas areas principais:

- area publica de autenticacao
- area protegida da aplicacao

A aplicacao inteira e envolvida por um `AppProvider`, responsavel por estado global, autenticacao local, persistencia e operacoes de negocio.

### 5.2 Layout global

Arquivo principal:

- `app/layout.tsx`

Responsabilidades:

- registrar metadata global
- carregar a fonte `Inter`
- envolver o app com `TooltipProvider`
- envolver o app com `AppProvider`

### 5.3 Estado global

Arquivo central:

- `components/providers/app-provider.tsx`

Responsabilidades do provider:

- carregar estado inicial
- persistir dados no navegador
- expor usuario logado
- autenticar usuario
- registrar novo usuario
- encerrar sessao
- criar ou atualizar projetos
- criar ou atualizar tarefas
- atualizar status de tarefas
- mover tarefas entre colunas e posicoes no Kanban

### 5.4 Persistencia

Chave principal no navegador:

```text
sgto:mvp-state
```

Estrutura persistida:

- `users`
- `session`
- `projects`
- `tasks`

Na primeira execucao, se nao houver dados armazenados ou se o JSON estiver invalido, o sistema recria um estado inicial usando seed local.

---

## 6. Fluxo de navegacao e protecao de rotas

### 6.1 Entrada pela rota raiz

Arquivo:

- `app/page.tsx`

Comportamento:

- se houver sessao valida, redireciona para `/dashboard`
- se nao houver sessao, redireciona para `/login`

### 6.2 Rotas publicas

Layout:

- `app/(auth)/layout.tsx`

Comportamento:

- aguarda a hidratacao do estado
- se existir usuario autenticado, redireciona para `/dashboard`
- se nao existir usuario, renderiza as paginas de autenticacao

Paginas publicas:

- `/login`
- `/cadastro`

### 6.3 Rotas protegidas

Layout:

- `app/(app)/layout.tsx`

Comportamento:

- aguarda a hidratacao do estado
- se nao houver usuario autenticado, redireciona para `/login`
- se houver sessao valida, renderiza a aplicacao dentro de `AppShell`

Paginas protegidas:

- `/dashboard`
- `/projetos`
- `/kanban`
- `/calendario`

---

## 7. Modelos de dados

Arquivo de tipos:

- `lib/types.ts`

### 7.1 User

```text
id
name
email
password
createdAt
```

### 7.2 Session

```text
userId
loggedInAt
```

### 7.3 Project

```text
id
name
description
dueDate
memberIds[]
createdAt
```

### 7.4 Task

```text
id
projectId
title
description
status
priority
assigneeId
dueDate
createdAt
completedAt
```

### 7.5 Enumeracoes

Status aceitos:

- `todo`
- `doing`
- `done`

Prioridades aceitas:

- `low`
- `medium`
- `high`

Metadados de apoio:

- labels amigaveis em portugues
- descricoes por status
- classes de tom visual para badges

Arquivo:

- `lib/task-metadata.ts`

---

## 8. Seed de dados e demonstracao

Arquivo:

- `lib/seed-data.ts`

Na primeira execucao, o sistema gera automaticamente:

- 3 usuarios
- 3 projetos
- 7 tarefas

Usuarios seed:

- `gestor@projeto.com`
- `analista@projeto.com`
- `ux@projeto.com`

Senha seed:

- `123456`

Credencial principal para demonstracao rapida:

- E-mail: `gestor@projeto.com`
- Senha: `123456`

---

## 9. Documentacao funcional por tela

### 9.1 Login

Arquivo:

- `app/(auth)/login/page.tsx`

Comportamento:

- campos de e-mail e senha
- credenciais demo ja preenchidas no estado inicial da pagina
- botao para aplicar novamente o acesso demo
- validacao local
- toast de sucesso ou erro
- redirecionamento para `/dashboard` apos login

### 9.2 Cadastro

Arquivo:

- `app/(auth)/cadastro/page.tsx`

Comportamento:

- cria usuario localmente
- bloqueia e-mail duplicado
- cria sessao automaticamente apos cadastro
- redireciona para `/dashboard`

### 9.3 Dashboard

Arquivo:

- `app/(app)/dashboard/page.tsx`

Blocos principais:

- cards-resumo com projetos ativos, tarefas abertas, prazos criticos e conclusao geral
- grafico `Carga por etapa` usando `Recharts`
- tabela responsiva de tarefas recentes
- painel `Ritmo da operacao`
- painel `Central de atencao`
- acoes rapidas para criar projeto e tarefa

### 9.4 Projetos

Arquivo:

- `app/(app)/projetos/page.tsx`

Funcionalidades:

- lista todos os projetos
- mostra estado vazio se nao houver dados
- renderiza cards com resumo de prazo, tarefas, concluidas e equipe
- abre modal para criar projeto
- abre modal para editar projeto

### 9.5 Modal de projeto

Arquivo:

- `components/app/project-form-dialog.tsx`

Campos:

- nome
- descricao
- prazo final
- membros do projeto

### 9.6 Tarefas

Principal modal:

- `components/app/task-form-dialog.tsx`

Campos:

- titulo
- descricao
- projeto
- responsavel
- prioridade
- status
- prazo

### 9.7 Card de tarefa

Arquivo:

- `components/app/task-card.tsx`

Informacoes e acoes:

- badge de status
- badge de prioridade
- titulo e descricao
- prazo com destaque visual para atraso
- projeto vinculado
- responsavel
- botao de edicao
- botoes para mover tarefa entre status

### 9.8 Kanban

Arquivo:

- `app/(app)/kanban/page.tsx`

Funcionalidades:

- colunas `A fazer`, `Em andamento` e `Concluido`
- filtro por projeto
- criacao rapida de tarefa
- drag-and-drop entre colunas e tambem dentro da mesma coluna
- movimentacao por botoes laterais em cada card

### 9.9 Calendario

Arquivo:

- `app/(app)/calendario/page.tsx`

Funcionalidades:

- calendario mensal
- dias com tarefas marcados visualmente
- selecao de data
- lista de tarefas do dia
- estado vazio quando nao houver tarefas
- painel lateral com proximos prazos

### 9.10 Shell da aplicacao

Arquivos:

- `components/app/app-shell.tsx`
- `components/app/app-sidebar.tsx`

Responsabilidades:

- sidebar responsiva
- breadcrumbs
- menu principal
- contadores por secao
- lista resumida de projetos ativos
- alternancia de tema
- menu do usuario com logout

---

## 10. Componentes e responsabilidades

### 10.1 Componentes de dominio

Pasta:

- `components/app`

Principais arquivos:

- `app-breadcrumbs.tsx`
- `app-shell.tsx`
- `app-sidebar.tsx`
- `auth-shell.tsx`
- `dashboard-status-chart.tsx`
- `dashboard-tasks-table.tsx`
- `empty-state.tsx`
- `mode-toggle.tsx`
- `page-heading.tsx`
- `project-card.tsx`
- `project-form-dialog.tsx`
- `task-card.tsx`
- `task-form-dialog.tsx`

### 10.2 Provider global

Pasta:

- `components/providers`

Arquivo:

- `app-provider.tsx`

### 10.3 Componentes base reutilizaveis

Pasta:

- `components/ui`

Essa pasta concentra os componentes base do design system local, em grande parte derivados do ecossistema `shadcn/ui`.

---

## 11. Estrutura de pastas

Estrutura resumida do projeto:

```text
app/
  favicon.ico
  globals.css
  layout.tsx
  page.tsx
  (app)/
    layout.tsx
    calendario/page.tsx
    dashboard/page.tsx
    kanban/page.tsx
    projetos/page.tsx
  (auth)/
    layout.tsx
    cadastro/page.tsx
    login/page.tsx

components/
  app/
  providers/
  ui/

hooks/
  use-mobile.ts

lib/
  seed-data.ts
  task-metadata.ts
  types.ts
  utils.ts

public/
  screenshots/
    dashboard-dark.png
    login-dark.png
```

---

## 12. Execucao local

### 12.1 Instalacao

```bash
npm install
```

### 12.2 Ambiente de desenvolvimento

```bash
npm run dev
```

### 12.3 Build de producao

```bash
npm run build
```

### 12.4 Execucao da build

```bash
npm run start
```

### 12.5 Lint

```bash
npm run lint
```

URL local padrao:

```text
http://localhost:3000
```

---

## 13. Validacao tecnica realizada

Esta consolidacao foi conferida contra o codigo atual do repositorio e validada com:

```bash
npm run lint
npm run build
```

Resultado observado em 03/04/2026:

- `eslint` executou com sucesso
- `next build` concluiu com sucesso
- rotas estaticas geradas: `/`, `/login`, `/cadastro`, `/dashboard`, `/projetos`, `/kanban`, `/calendario`

---

## 14. Interface, UX e identidade visual

Diretrizes percebidas no codigo atual:

- tipografia com `Inter`
- linguagem visual corporativa e limpa
- cards com cantos grandes e aspecto moderno
- uso consistente de badges para status e prioridade
- sidebar com indicadores numericos
- feedback imediato por toasts
- componentes responsivos para desktop e mobile
- suporte a tema claro, escuro e configuracao do sistema

Assets visuais presentes no repositorio:

- `public/screenshots/login-dark.png`
- `public/screenshots/dashboard-dark.png`

---

## 15. Limitacoes atuais

Mesmo sendo funcional, o projeto ainda possui limitacoes tipicas de um MVP frontend:

- nao existe backend real
- nao existe banco de dados externo
- autenticacao e estritamente local
- senhas ficam armazenadas localmente para fins de demonstracao
- o estado depende de `localStorage`
- nao ha controle de perfis e permissoes
- nao ha sincronizacao multiusuario real
- nao ha anexos, comentarios ou notificacoes

---

## 16. Evolucoes recomendadas

Proximos passos naturais para uma versao mais robusta:

- migrar persistencia para banco de dados
- adicionar backend e API real
- implementar autenticacao segura
- criar perfis e permissoes
- adicionar historico de alteracoes
- incluir anexos e comentarios por tarefa
- adicionar filtros avancados e busca
- incluir relatorios e indicadores analiticos
- enviar notificacoes de prazo
- publicar ambiente de demonstracao online

---

## 17. Fontes consolidadas nesta documentacao

Arquivos usados como base e cruzados com o codigo:

- `README.md`
- `package.json`
- `app/layout.tsx`
- `app/page.tsx`
- `app/(auth)/layout.tsx`
- `app/(auth)/login/page.tsx`
- `app/(auth)/cadastro/page.tsx`
- `app/(app)/layout.tsx`
- `app/(app)/dashboard/page.tsx`
- `app/(app)/projetos/page.tsx`
- `app/(app)/kanban/page.tsx`
- `app/(app)/calendario/page.tsx`
- `components/providers/app-provider.tsx`
- `components/app/project-form-dialog.tsx`
- `components/app/task-form-dialog.tsx`
- `components/app/project-card.tsx`
- `components/app/task-card.tsx`
- `components/app/app-shell.tsx`
- `components/app/app-sidebar.tsx`
- `components/app/dashboard-status-chart.tsx`
- `components/app/dashboard-tasks-table.tsx`
- `lib/types.ts`
- `lib/seed-data.ts`
- `lib/task-metadata.ts`

---

## 18. Conclusao

O projeto entrega um sistema funcional de gerenciamento de tarefas com uma base moderna, organizada e coerente para apresentacao academica. A aplicacao possui fluxo completo de acesso, operacao de projetos e tarefas, visualizacao gerencial no dashboard, acompanhamento visual em Kanban e controle de prazos em calendario.

Esta documentacao foi consolidada para servir como referencia unica do projeto e para facilitar entrega, apresentacao, manutencao e futuras evolucoes.
