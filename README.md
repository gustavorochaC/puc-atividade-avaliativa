# Sistema Gerenciador de Tarefas

MVP funcional de um sistema web para gerenciamento de projetos e tarefas, desenvolvido para o Projeto Integrador.

O app foi construido com:

- `Next.js`
- `React`
- `TypeScript`
- `Tailwind CSS`
- `shadcn/ui`
- `Inter`

Nesta versao, o sistema funciona totalmente no frontend, com persistencia local em `localStorage`.

## Funcionalidades

- login local
- cadastro de usuario
- dashboard com resumo operacional
- criacao e edicao de projetos
- criacao e edicao de tarefas
- quadro Kanban com mudanca de status
- calendario com tarefas por data
- dados iniciais para demonstracao

## Como rodar o projeto

Instale as dependencias:

```bash
npm install
```

Inicie o ambiente de desenvolvimento:

```bash
npm run dev
```

Abra no navegador:

```bash
http://localhost:3000
```

Para validar o projeto:

```bash
npm run lint
npm run build
```

## Acesso de demonstracao

Usuario inicial:

- E-mail: `gestor@projeto.com`
- Senha: `123456`

Tambem e possivel criar um novo usuario pela tela de cadastro.

## Estrutura principal

- `app/(auth)`  
  Rotas de login e cadastro.

- `app/(app)`  
  Rotas protegidas do sistema: dashboard, projetos, kanban e calendario.

- `components/app`  
  Componentes de interface do dominio, como cards, dialogs e shell do sistema.

- `components/providers/app-provider.tsx`  
  Estado global do app, autenticacao local, persistencia e operacoes principais.

- `lib/types.ts`  
  Tipos centrais do sistema.

- `lib/seed-data.ts`  
  Dados iniciais carregados na primeira execucao.

## Persistencia

Os dados do sistema sao armazenados no navegador usando:

```text
sgto:mvp-state
```

Nessa chave ficam salvos:

- usuarios
- sessao
- projetos
- tarefas

## Documentacao completa

Para a explicacao detalhada passo a passo do app, consulte:

- [DOCUMENTACAO_APP.md](./DOCUMENTACAO_APP.md)

## Resumo da entrega

Este projeto entrega um fluxo funcional de gerenciamento de tarefas com interface limpa, navegacao simples e organizacao suficiente para demonstracao academica ou apresentacao de MVP.
