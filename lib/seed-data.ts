import { addDays, setHours, setMinutes } from "date-fns";
import type { AppState, Project, Task, User } from "@/lib/types";

const createIso = (baseDate: Date, offsetInDays: number, hour: number) =>
  setMinutes(setHours(addDays(baseDate, offsetInDays), hour), 0).toISOString();

const createUsers = (createdAt: string): User[] => [
  {
    id: "user-admin",
    name: "Marina Lima",
    email: "gestor@projeto.com",
    password: "123456",
    createdAt,
  },
  {
    id: "user-analyst",
    name: "Carlos Mendes",
    email: "analista@projeto.com",
    password: "123456",
    createdAt,
  },
  {
    id: "user-design",
    name: "Fernanda Rocha",
    email: "ux@projeto.com",
    password: "123456",
    createdAt,
  },
];

export function createSeedData(): AppState {
  const now = new Date();
  const createdAt = now.toISOString();
  const users = createUsers(createdAt);

  const projects: Project[] = [
    {
      id: "project-intranet",
      name: "Portal Interno",
      description:
        "Centralizar comunicados, documentos e rotinas da equipe administrativa.",
      dueDate: createIso(now, 10, 18),
      memberIds: ["user-admin", "user-analyst"],
      createdAt,
    },
    {
      id: "project-onboarding",
      name: "Jornada de Onboarding",
      description:
        "Organizar tarefas recorrentes para recepcao, treinamento e acompanhamento de novos membros.",
      dueDate: createIso(now, 18, 17),
      memberIds: ["user-admin", "user-design"],
      createdAt,
    },
    {
      id: "project-events",
      name: "Calendario de Eventos",
      description:
        "Acompanhar entregas, materiais e prazos do proximo ciclo de eventos institucionais.",
      dueDate: createIso(now, -2, 16),
      memberIds: ["user-analyst", "user-design"],
      createdAt,
    },
  ];

  const tasks: Task[] = [
    {
      id: "task-briefing",
      projectId: "project-intranet",
      title: "Reunir requisitos com a equipe",
      description:
        "Consolidar necessidades do setor e listar prioridades para a primeira entrega.",
      status: "doing",
      priority: "high",
      assigneeId: "user-admin",
      dueDate: createIso(now, 1, 14),
      createdAt,
      completedAt: null,
    },
    {
      id: "task-wireframe",
      projectId: "project-intranet",
      title: "Estruturar wireframes do dashboard",
      description:
        "Definir hierarquia das informacoes e fluxo basico de navegacao.",
      status: "todo",
      priority: "medium",
      assigneeId: "user-design",
      dueDate: createIso(now, 3, 16),
      createdAt,
      completedAt: null,
    },
    {
      id: "task-content-map",
      projectId: "project-onboarding",
      title: "Mapear conteudos de integracao",
      description:
        "Listar documentos, treinamentos e etapas que precisam entrar na trilha.",
      status: "todo",
      priority: "medium",
      assigneeId: "user-analyst",
      dueDate: createIso(now, 5, 10),
      createdAt,
      completedAt: null,
    },
    {
      id: "task-calendar",
      projectId: "project-events",
      title: "Publicar cronograma preliminar",
      description:
        "Subir o primeiro calendario com marcos de planejamento e checkpoints.",
      status: "doing",
      priority: "high",
      assigneeId: "user-analyst",
      dueDate: createIso(now, 0, 11),
      createdAt,
      completedAt: null,
    },
    {
      id: "task-sponsors",
      projectId: "project-events",
      title: "Confirmar parceiros do evento",
      description:
        "Registrar retorno de patrocinadores e consolidar contrapartidas acordadas.",
      status: "done",
      priority: "low",
      assigneeId: "user-admin",
      dueDate: createIso(now, -4, 15),
      createdAt,
      completedAt: createIso(now, -5, 10),
    },
    {
      id: "task-kit",
      projectId: "project-onboarding",
      title: "Montar kit de boas-vindas",
      description:
        "Separar checklist de acesso, material institucional e manual rapido.",
      status: "done",
      priority: "medium",
      assigneeId: "user-design",
      dueDate: createIso(now, -1, 13),
      createdAt,
      completedAt: createIso(now, -1, 9),
    },
    {
      id: "task-review",
      projectId: "project-events",
      title: "Revisar lista de fornecedores",
      description:
        "Atualizar contatos, escopo e responsaveis por cada frente de contratacao.",
      status: "todo",
      priority: "high",
      assigneeId: "user-design",
      dueDate: createIso(now, -1, 17),
      createdAt,
      completedAt: null,
    },
  ];

  return {
    users,
    session: null,
    projects,
    tasks,
  };
}
