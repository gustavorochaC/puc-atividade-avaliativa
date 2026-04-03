# Sistema Gerenciador de Tarefas

Aplicacao web desenvolvida como atividade avaliativa para demonstrar um fluxo completo de gerenciamento de projetos e tarefas. O sistema foi construido como um MVP funcional, com interface moderna, autenticacao local, dashboard executivo, quadro Kanban, calendario de entregas e persistencia no navegador.

## Visao Geral

Este projeto simula um ambiente simples de organizacao de demandas internas. A proposta e permitir que um usuario consiga:

- entrar ou criar uma conta localmente
- cadastrar projetos
- criar, editar e acompanhar tarefas
- visualizar o andamento do trabalho em um dashboard
- acompanhar o fluxo em Kanban
- controlar prazos em calendario

Nesta versao, toda a aplicacao funciona no frontend e utiliza `localStorage` para manter os dados entre recargas de pagina.

## Funcionalidades

### 1. Autenticacao local

- tela de login com credenciais demo
- tela de cadastro para novos usuarios
- persistencia de sessao no navegador
- redirecionamento automatico entre rotas publicas e protegidas

### 2. Dashboard executivo

- cards com resumo da operacao
- grafico com distribuicao das tarefas por etapa
- tabela/lista responsiva com tarefas recentes
- painel lateral com indicadores de ritmo da operacao
- central de atencao com foco em prazos e equipe

### 3. Gestao de projetos

- cadastro de projetos com nome, descricao e prazo
- associacao de membros a cada projeto
- visualizacao de progresso com base nas tarefas vinculadas
- edicao rapida por modal

### 4. Gestao de tarefas

- criacao e edicao de tarefas por modal
- vinculacao com projeto e responsavel
- controle de prioridade e status
- atualizacao do status com reflexo no dashboard, kanban e calendario

### 5. Quadro Kanban

- organizacao em tres colunas:
  - `A fazer`
  - `Em andamento`
  - `Concluido`
- movimentacao simples entre etapas
- filtro por projeto
- leitura visual de prioridade, responsavel e prazo

### 6. Calendario de entregas

- calendario mensal com marcacao de dias que possuem tarefas
- selecao de data para listar entregas do dia
- painel com proximos prazos

### 7. Interface e tema

- layout corporativo com `shadcn/ui`
- sidebar responsiva
- dashboard adaptado para diferentes larguras de tela
- suporte a tema `light`, `dark` e `system`
- tipografia com `Inter`

## Stack do Projeto

| Tecnologia | Papel no projeto |
| --- | --- |
| `Next.js 16` | Estrutura principal da aplicacao e roteamento com App Router |
| `React 19` | Construcao da interface com componentes |
| `TypeScript` | Tipagem dos dados e seguranca no desenvolvimento |
| `Tailwind CSS 4` | Estilizacao utilitaria e tokens visuais |
| `shadcn/ui` | Base dos componentes de interface |
| `Radix UI` | Primitivos acessiveis usados pelos componentes do `shadcn/ui` |
| `next-themes` | Controle de tema claro/escuro |
| `date-fns` | Formatacao e manipulacao de datas |
| `Recharts` | Grafico do dashboard |
| `Sonner` | Notificacoes de feedback |
| `Lucide React` | Iconografia da interface |

## Arquitetura Funcional

O projeto foi organizado para separar claramente rotas, componentes de interface, estado global e utilitarios.

### Rotas

- `app/(auth)`
  - telas publicas de `login` e `cadastro`
- `app/(app)`
  - telas protegidas do sistema
  - `dashboard`
  - `projetos`
  - `kanban`
  - `calendario`

### Estado global

O estado principal da aplicacao fica em:

- `components/providers/app-provider.tsx`

Esse provider e responsavel por:

- carregar dados iniciais
- salvar e recuperar dados do `localStorage`
- controlar a sessao do usuario
- criar e atualizar projetos
- criar e atualizar tarefas
- sincronizar mudancas entre as telas

### Tipos centrais

Os principais contratos do sistema ficam em:

- `lib/types.ts`

Entre eles:

- `User`
- `Session`
- `Project`
- `Task`
- `TaskStatus`
- `TaskPriority`

## Persistencia de Dados

O sistema utiliza a chave abaixo no navegador:

```text
sgto:mvp-state
```

Dentro dela sao salvos:

- usuarios
- sessao
- projetos
- tarefas

Isso permite que a aplicacao continue funcional mesmo sem backend ou banco de dados externo.

## Dados de Demonstracao

Na primeira execucao, o app gera dados iniciais automaticamente para facilitar a apresentacao.

### Credenciais demo

- E-mail: `gestor@projeto.com`
- Senha: `123456`

Tambem e possivel criar um novo usuario pela tela de cadastro.

## Como Executar o Projeto

### 1. Instalar dependencias

```bash
npm install
```

### 2. Rodar em desenvolvimento

```bash
npm run dev
```

### 3. Acessar no navegador

```bash
http://localhost:3000
```

## Scripts Disponiveis

```bash
npm run dev
```

Inicia o ambiente de desenvolvimento.

```bash
npm run build
```

Gera a build de producao.

```bash
npm run start
```

Executa a aplicacao em modo de producao.

```bash
npm run lint
```

Valida padroes de codigo com ESLint.

## Estrutura do Projeto

```text
app/
  (auth)/
  (app)/
components/
  app/
  providers/
  ui/
hooks/
lib/
public/
```

### Pastas principais

- `components/app`
  - componentes de dominio do sistema, como shells, cards e dialogs
- `components/ui`
  - componentes base do `shadcn/ui`
- `hooks`
  - hooks utilitarios da interface
- `lib`
  - tipos, metadados e seed inicial

## Validacao Realizada

O projeto foi validado com:

```bash
npm run lint
npm run build
```

Ambos os comandos passaram com sucesso.

## Limitacoes do MVP

Por se tratar de uma entrega funcional de frontend, esta versao possui algumas limitacoes esperadas:

- nao utiliza backend real
- nao utiliza banco de dados externo
- autenticacao apenas local
- dados restritos ao navegador atual
- quadro Kanban sem drag and drop

Ainda assim, o projeto atende o fluxo principal solicitado pela atividade e esta pronto para demonstracao academica.

## Evolucoes Futuras

Algumas melhorias naturais para uma proxima versao seriam:

- integracao com banco de dados
- autenticacao real com backend
- permissao por perfil de usuario
- notificacoes e alertas automatizados
- anexos em tarefas
- drag and drop no Kanban
- relatorios de produtividade

## Documentacao Complementar

Para uma explicacao mais detalhada do funcionamento do sistema, consulte:

- [DOCUMENTACAO_APP.md](./DOCUMENTACAO_APP.md)

## Resumo

Este repositorio entrega uma base moderna, funcional e bem organizada para gerenciamento de tarefas, com foco em:

- experiencia visual clara
- navegacao simples
- persistencia local
- demonstracao academica
- facilidade de evolucao futura
