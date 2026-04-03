# Documentacao do Sistema Gerenciador de Tarefas

## 1. Visao geral

Este projeto e um MVP funcional de um sistema web de gerenciamento de tarefas, criado para atender ao escopo do Projeto Integrador.

O app foi desenvolvido com:

- `Next.js`
- `React`
- `TypeScript`
- `Tailwind CSS`
- `shadcn/ui`
- `Inter`

O sistema funciona totalmente no frontend, com persistencia local em `localStorage`, sem backend real nesta versao.

---

## 2. Objetivo do app

O objetivo do sistema e permitir que uma organizacao consiga:

- cadastrar usuarios
- realizar login
- criar projetos
- criar tarefas
- acompanhar tarefas por status
- visualizar o fluxo em quadro Kanban
- acompanhar prazos em calendario

Esse modelo atende diretamente ao requisito do trabalho, que pede um sistema de gestao de tarefas e projetos com visualizacao organizada das demandas.

---

## 3. Como executar o projeto

No terminal, dentro da pasta do projeto:

```bash
npm install
npm run dev
```

Depois disso, abra no navegador:

```bash
http://localhost:3000
```

Para gerar a versao de producao:

```bash
npm run build
```

---

## 4. Acesso de demonstracao

O sistema ja vem com dados iniciais carregados automaticamente.

Usuario demo:

- E-mail: `gestor@projeto.com`
- Senha: `123456`

Tambem e possivel criar um novo usuario pela tela de cadastro.

---

## 5. Passo a passo de uso do app

## 5.1 Tela inicial

Ao abrir o sistema, a rota `/` redireciona automaticamente:

- para `/login`, se nao existir sessao ativa
- para `/dashboard`, se o usuario ja estiver autenticado

Isso garante que o app sempre abra no fluxo correto.

---

## 5.2 Login

Na tela de login, o usuario pode:

- informar e-mail
- informar senha
- entrar no sistema

Se os dados estiverem corretos, o app salva a sessao no `localStorage` e redireciona para o dashboard.

Se os dados estiverem incorretos, o sistema exibe uma notificacao de erro.

---

## 5.3 Cadastro

Na tela de cadastro, o usuario pode:

- informar nome
- informar e-mail
- criar senha

Ao concluir:

- o usuario e salvo localmente
- a sessao e criada automaticamente
- o sistema redireciona para o dashboard

Se o e-mail ja existir, o sistema bloqueia o cadastro e exibe aviso.

---

## 5.4 Dashboard

O dashboard e a tela principal do sistema.

Nele o usuario consegue visualizar:

- quantidade de projetos ativos
- quantidade de tarefas abertas
- quantidade de tarefas concluidas
- quantidade de tarefas em atraso

Tambem ha blocos com:

- tarefas com vencimento proximo
- resumo das entregas do dia
- acesso rapido para Kanban e Calendario
- projetos em destaque
- tarefas abertas para atualizacao rapida

Essa tela funciona como um painel executivo resumido.

---

## 5.5 Tela de Projetos

Na tela `/projetos`, o usuario consegue:

- visualizar todos os projetos cadastrados
- criar um novo projeto
- editar um projeto existente
- definir membros participantes
- definir prazo final
- acompanhar progresso com base nas tarefas vinculadas

Cada projeto mostra:

- nome
- descricao
- prazo
- quantidade de tarefas
- quantidade de concluidas
- porcentagem de andamento
- membros envolvidos

### Criando um projeto

Ao clicar em `Novo projeto`, o usuario abre um modal com:

- nome do projeto
- descricao
- prazo final
- selecao de membros

Ao salvar:

- o projeto e armazenado no `localStorage`
- ele passa a aparecer automaticamente nas telas do sistema

---

## 5.6 Criacao e edicao de tarefas

As tarefas podem ser criadas a partir de varios pontos do sistema.

O formulario da tarefa permite informar:

- titulo
- descricao
- projeto vinculado
- responsavel
- prioridade
- status
- prazo

Ao salvar:

- a tarefa e gravada localmente
- ela ja aparece no dashboard
- aparece no Kanban
- aparece no Calendario conforme a data escolhida

Tambem e possivel editar uma tarefa existente pelo botao de edicao presente nos cards.

---

## 5.7 Tela Kanban

Na tela `/kanban`, o sistema mostra as tarefas em tres colunas:

- `A fazer`
- `Em andamento`
- `Concluido`

Cada card de tarefa mostra:

- titulo
- descricao
- prioridade
- status
- prazo
- projeto
- responsavel

### Como atualizar o status no Kanban

Cada card possui botoes para:

- voltar uma etapa
- avancar uma etapa

Exemplo:

- de `A fazer` para `Em andamento`
- de `Em andamento` para `Concluido`

Quando a tarefa vai para `Concluido`, o sistema registra automaticamente a data de conclusao.

Tambem existe um filtro por projeto para visualizar somente as tarefas de uma frente especifica.

---

## 5.8 Tela Calendario

Na tela `/calendario`, o usuario consegue:

- visualizar um calendario mensal
- identificar dias que possuem tarefas
- clicar em uma data especifica
- ver todas as tarefas daquele dia
- acompanhar os proximos prazos em uma lista lateral

Essa tela ajuda a controlar entregas e vencimentos.

---

## 5.9 Navegacao lateral

Quando o usuario esta autenticado, o app exibe uma navegacao lateral com acesso para:

- Dashboard
- Projetos
- Kanban
- Calendario

No mobile, essa navegacao aparece em formato de menu lateral.

Tambem existe a opcao de `Sair`, que encerra a sessao atual.

---

## 6. Como os dados funcionam

O sistema usa `localStorage` para guardar tudo localmente no navegador.

Chave principal utilizada:

```text
sgto:mvp-state
```

Nessa estrutura ficam armazenados:

- usuarios
- sessao
- projetos
- tarefas

Isso significa que:

- os dados permanecem mesmo apos atualizar a pagina
- o sistema continua funcionando sem backend
- o app fica ideal para demonstracao academica e MVP

---

## 7. Dados iniciais do sistema

Na primeira execucao, o sistema cria automaticamente:

- usuarios de exemplo
- projetos de exemplo
- tarefas de exemplo

Isso foi feito para que o app ja abra funcional e visualmente completo, sem depender de cadastro manual antes da demonstracao.

---

## 8. Estrutura principal do projeto

Os arquivos mais importantes sao:

- `app/layout.tsx`
  Responsavel pelo layout global, metadata e configuracao da fonte `Inter`.

- `components/providers/app-provider.tsx`
  Responsavel pelo estado global do app, autenticacao local, persistencia e operacoes de projeto e tarefa.

- `lib/types.ts`
  Define os tipos principais do sistema, como `User`, `Project`, `Task`, `Session`, `TaskStatus` e `TaskPriority`.

- `lib/seed-data.ts`
  Gera os dados iniciais usados no primeiro carregamento.

- `app/(auth)/login/page.tsx`
  Tela de login.

- `app/(auth)/cadastro/page.tsx`
  Tela de cadastro.

- `app/(app)/dashboard/page.tsx`
  Tela principal com resumo do sistema.

- `app/(app)/projetos/page.tsx`
  Tela de gerenciamento de projetos.

- `app/(app)/kanban/page.tsx`
  Quadro Kanban.

- `app/(app)/calendario/page.tsx`
  Calendario de entregas.

---

## 9. Tipos de dados utilizados

### Usuario

Cada usuario possui:

- `id`
- `name`
- `email`
- `password`
- `createdAt`

### Sessao

Cada sessao possui:

- `userId`
- `loggedInAt`

### Projeto

Cada projeto possui:

- `id`
- `name`
- `description`
- `dueDate`
- `memberIds`
- `createdAt`

### Tarefa

Cada tarefa possui:

- `id`
- `projectId`
- `title`
- `description`
- `status`
- `priority`
- `assigneeId`
- `dueDate`
- `createdAt`
- `completedAt`

Os status aceitos sao:

- `todo`
- `doing`
- `done`

As prioridades aceitas sao:

- `low`
- `medium`
- `high`

---

## 10. Interface e UX

O visual foi pensado como:

- neutro
- limpo
- corporativo
- funcional

As decisoes principais de interface foram:

- uso da fonte `Inter`
- componentes `shadcn/ui`
- cards com bordas suaves
- hierarquia visual clara
- navegacao simples
- foco em produtividade

O objetivo nao foi criar uma identidade visual complexa, e sim uma interface pronta para demonstracao e facil de entender.

---

## 11. Limitacoes atuais do MVP

Como esta e uma versao de frontend funcional, algumas limitacoes sao esperadas:

- nao existe backend real
- nao existe banco de dados externo
- a autenticacao nao usa API
- os dados ficam apenas no navegador
- o Kanban nao usa drag-and-drop

Mesmo assim, o sistema entrega o fluxo completo pedido pelo trabalho.

---

## 12. Possiveis evolucoes futuras

Se o projeto for evoluido depois, os proximos passos mais naturais seriam:

- integrar banco de dados
- criar backend real para autenticacao
- adicionar permissao por perfil
- implementar drag-and-drop no Kanban
- permitir anexos em tarefas
- criar notificacoes automáticas
- gerar relatorios de produtividade

---

## 13. Validacao realizada

O projeto foi validado com:

```bash
npm run lint
npm run build
```

Ambos passaram com sucesso.

---

## 14. Resumo final

Este app entrega um sistema funcional de gerenciamento de tarefas com:

- login
- cadastro
- dashboard
- projetos
- tarefas
- Kanban
- calendario

Tudo isso dentro de uma estrutura moderna, organizada e adequada para apresentacao academica ou demonstracao de MVP.
