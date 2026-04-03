"use client";

import { useState } from "react";
import { KanbanSquare } from "lucide-react";
import { EmptyState } from "@/components/app/empty-state";
import { PageHeading } from "@/components/app/page-heading";
import { TaskCard } from "@/components/app/task-card";
import { TaskFormDialog } from "@/components/app/task-form-dialog";
import { useAppStore } from "@/components/providers/app-provider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { statusDescriptions, statusLabels } from "@/lib/task-metadata";
import type { TaskStatus } from "@/lib/types";

const columns: TaskStatus[] = ["todo", "doing", "done"];

export default function KanbanPage() {
  const { state } = useAppStore();
  const [projectFilter, setProjectFilter] = useState("all");

  const filteredTasks =
    projectFilter === "all"
      ? state.tasks
      : state.tasks.filter((task) => task.projectId === projectFilter);

  return (
    <div className="space-y-6">
      <PageHeading
        eyebrow="Fluxo visual"
        title="Quadro Kanban"
        description="Visualize as tarefas por etapa do fluxo e mova cada item de forma simples, sem drag-and-drop."
        action={<TaskFormDialog />}
      />

      <div className="flex flex-col gap-4 rounded-[28px] border border-border/80 bg-card/95 p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium">Filtro por projeto</p>
          <p className="text-sm text-muted-foreground">
            Escolha um projeto ou mantenha a visao consolidada.
          </p>
        </div>

        <div className="w-full sm:w-[280px]">
          <Select value={projectFilter} onValueChange={setProjectFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Todos os projetos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os projetos</SelectItem>
              {state.projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <EmptyState
          icon={<KanbanSquare className="size-6" />}
          title="Nenhuma tarefa encontrada"
          description="Crie uma nova tarefa ou ajuste o filtro para visualizar outras etapas do fluxo."
          action={<TaskFormDialog />}
        />
      ) : (
        <div className="grid gap-5 xl:grid-cols-3">
          {columns.map((column) => {
            const columnTasks = filteredTasks.filter((task) => task.status === column);

            return (
              <section
                key={column}
                className="rounded-[30px] border border-border/80 bg-card/95 p-5 shadow-sm"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-lg font-semibold">{statusLabels[column]}</h2>
                    <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                      {columnTasks.length}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {statusDescriptions[column]}
                  </p>
                </div>

                <div className="mt-5 space-y-4">
                  {columnTasks.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-border bg-background/80 px-4 py-8 text-center text-sm text-muted-foreground">
                      Sem tarefas nesta etapa.
                    </div>
                  ) : (
                    columnTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        project={state.projects.find((item) => item.id === task.projectId)}
                        assignee={state.users.find((item) => item.id === task.assigneeId)}
                      />
                    ))
                  )}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
