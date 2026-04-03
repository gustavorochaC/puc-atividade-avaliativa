"use client";

import { useState, type DragEvent } from "react";
import { GripVertical, KanbanSquare } from "lucide-react";
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
import { cn } from "@/lib/utils";

const columns: TaskStatus[] = ["todo", "doing", "done"];

type DragState = {
  taskId: string;
  status: TaskStatus;
  index: number;
};

type DropTarget = {
  status: TaskStatus;
  index: number;
};

export default function KanbanPage() {
  const { state, moveTask } = useAppStore();
  const [projectFilter, setProjectFilter] = useState("all");
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [dropTarget, setDropTarget] = useState<DropTarget | null>(null);

  const filteredTasks =
    projectFilter === "all"
      ? state.tasks
      : state.tasks.filter((task) => task.projectId === projectFilter);

  const updateDropTarget = (status: TaskStatus, index: number) => {
    setDropTarget((current) => {
      if (current?.status === status && current.index === index) {
        return current;
      }

      return { status, index };
    });
  };

  const clearDragState = () => {
    setDragState(null);
    setDropTarget(null);
  };

  const handleDrop = (
    status: TaskStatus,
    columnTasks: typeof filteredTasks,
    fallbackIndex: number,
  ) => (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const taskId = event.dataTransfer.getData("text/plain") || dragState?.taskId;
    const sourceTask = state.tasks.find((item) => item.id === taskId);

    if (!sourceTask || !dragState) {
      clearDragState();
      return;
    }

    const rawTargetIndex =
      dropTarget?.status === status ? dropTarget.index : fallbackIndex;
    const destinationTasks = columnTasks.filter((task) => task.id !== dragState.taskId);
    const adjustedIndex =
      dragState.status === status && dragState.index < rawTargetIndex
        ? rawTargetIndex - 1
        : rawTargetIndex;
    const safeIndex = Math.max(0, Math.min(adjustedIndex, destinationTasks.length));
    const beforeTaskId = destinationTasks[safeIndex]?.id ?? null;

    moveTask(sourceTask.id, status, beforeTaskId);
    clearDragState();
  };

  return (
    <div className="space-y-6">
      <PageHeading
        eyebrow="Fluxo visual"
        title="Quadro Kanban"
        description="Visualize as tarefas por etapa do fluxo e mova cada item com drag-and-drop ou pelos botoes de status."
        action={<TaskFormDialog />}
      />

      <div className="flex flex-col gap-4 rounded-[28px] border border-border/80 bg-card/85 p-6 shadow-sm backdrop-blur sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium">Filtro por projeto</p>
          <p className="text-sm text-muted-foreground">
            Escolha um projeto ou mantenha a visao consolidada.
          </p>
        </div>

        <div className="w-full sm:ml-auto sm:w-auto sm:self-end sm:shrink-0">
          <Select value={projectFilter} onValueChange={setProjectFilter}>
            <SelectTrigger className="w-full rounded-2xl px-4 sm:min-w-[280px] sm:w-auto">
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
            const isDragActive = dragState !== null;
            const isColumnActive = dropTarget?.status === column;

            return (
              <section
                key={column}
                className={cn(
                  "rounded-[30px] border border-border/80 bg-card/95 p-5 shadow-sm transition-all duration-200",
                  isColumnActive && "border-primary/60 bg-primary/5 shadow-[0_0_0_1px_rgba(125,211,252,0.15)]",
                )}
                onDragOver={(event) => {
                  event.preventDefault();
                  event.dataTransfer.dropEffect = "move";

                  if (!dragState) {
                    return;
                  }

                  updateDropTarget(column, columnTasks.length);
                }}
                onDrop={handleDrop(column, columnTasks, columnTasks.length)}
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
                    <div
                      className={cn(
                        "rounded-2xl border border-dashed border-border bg-background/80 px-4 py-8 text-center text-sm text-muted-foreground transition-colors",
                        isColumnActive && "border-primary/60 bg-primary/5 text-foreground",
                      )}
                    >
                    {isDragActive
                        ? "Solte aqui para mover uma tarefa."
                        : "Sem tarefas nesta etapa."}
                    </div>
                  ) : (
                    <>
                      {columnTasks.map((task, index) => {
                        const project = state.projects.find((item) => item.id === task.projectId);
                        const assignee = state.users.find((item) => item.id === task.assigneeId);
                        const showMarkerAbove =
                          dropTarget?.status === column && dropTarget.index === index;

                        return (
                          <div
                            key={task.id}
                            className="group/task-wrapper space-y-3"
                            onDragOver={(event) => {
                              event.preventDefault();
                              event.stopPropagation();

                              if (!dragState) {
                                return;
                              }

                              const bounds = event.currentTarget.getBoundingClientRect();
                              const shouldInsertBefore =
                                event.clientY < bounds.top + bounds.height / 2;

                              updateDropTarget(column, shouldInsertBefore ? index : index + 1);
                            }}
                          >
                            <div
                              className={cn(
                                "overflow-hidden rounded-full transition-all duration-200",
                                showMarkerAbove
                                  ? "h-6 opacity-100"
                                  : "h-0 opacity-0 group-hover/task-wrapper:h-2",
                              )}
                            >
                              <div className="flex h-full items-center gap-2 rounded-full border border-dashed border-primary/50 bg-primary/10 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                                <GripVertical className="size-3.5" />
                                Solte aqui
                              </div>
                            </div>

                            <TaskCard
                              task={task}
                              project={project}
                              assignee={assignee}
                              draggable
                              isDragging={dragState?.taskId === task.id}
                              onDragStart={() => {
                                setDragState({
                                  taskId: task.id,
                                  status: column,
                                  index,
                                });
                                setDropTarget({
                                  status: column,
                                  index,
                                });
                              }}
                              onDragEnd={clearDragState}
                            />
                          </div>
                        );
                      })}

                      <div
                        className={cn(
                          "overflow-hidden rounded-full transition-all duration-200",
                          dropTarget?.status === column && dropTarget.index === columnTasks.length
                            ? "mt-3 h-6 opacity-100"
                            : "h-0 opacity-0",
                        )}
                      >
                        <div className="flex h-full items-center gap-2 rounded-full border border-dashed border-primary/50 bg-primary/10 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                          <GripVertical className="size-3.5" />
                          Solte no fim da coluna
                        </div>
                      </div>
                    </>
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
