import type { TaskPriority, TaskStatus } from "@/lib/types";

export const statusLabels: Record<TaskStatus, string> = {
  todo: "A fazer",
  doing: "Em andamento",
  done: "Concluido",
};

export const priorityLabels: Record<TaskPriority, string> = {
  low: "Baixa",
  medium: "Media",
  high: "Alta",
};

export const statusDescriptions: Record<TaskStatus, string> = {
  todo: "Itens aguardando inicio",
  doing: "Demandas em execucao",
  done: "Entregas finalizadas",
};

export const statusToneClasses: Record<TaskStatus, string> = {
  todo: "border-border bg-secondary text-secondary-foreground",
  doing: "border-blue-200 bg-blue-100 text-blue-700 dark:border-blue-900/60 dark:bg-blue-500/15 dark:text-blue-200",
  done: "border-emerald-200 bg-emerald-100 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-500/15 dark:text-emerald-200",
};

export const priorityToneClasses: Record<TaskPriority, string> = {
  low: "border-border bg-secondary text-secondary-foreground",
  medium: "border-amber-200 bg-amber-100 text-amber-700 dark:border-amber-900/60 dark:bg-amber-500/15 dark:text-amber-200",
  high: "border-rose-200 bg-rose-100 text-rose-700 dark:border-rose-900/60 dark:bg-rose-500/15 dark:text-rose-200",
};
