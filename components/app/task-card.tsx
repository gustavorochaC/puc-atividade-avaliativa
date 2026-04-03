"use client";

import { format, isPast } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowLeft, ArrowRight, CalendarDays, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TaskFormDialog } from "@/components/app/task-form-dialog";
import { useAppStore } from "@/components/providers/app-provider";
import {
  priorityLabels,
  priorityToneClasses,
  statusToneClasses,
} from "@/lib/task-metadata";
import type { Project, Task, User } from "@/lib/types";
import { cn } from "@/lib/utils";

type TaskCardProps = {
  task: Task;
  project?: Project;
  assignee?: User;
  showStatusActions?: boolean;
};

const statusSequence = ["todo", "doing", "done"] as const;

function getInitials(name?: string) {
  if (!name) {
    return "??";
  }

  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function TaskCard({
  task,
  project,
  assignee,
  showStatusActions = true,
}: TaskCardProps) {
  const { updateTaskStatus } = useAppStore();
  const taskDate = new Date(task.dueDate);
  const currentStatusIndex = statusSequence.indexOf(task.status);
  const canMoveBack = currentStatusIndex > 0;
  const canMoveForward = currentStatusIndex < statusSequence.length - 1;
  const isOverdue = task.status !== "done" && isPast(taskDate);

  return (
    <Card className="rounded-[26px] border-border/80 bg-card/95 shadow-sm">
      <CardContent className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className={cn("rounded-full border px-3 py-1", statusToneClasses[task.status])}
              >
                {task.status === "done"
                  ? "Concluido"
                  : task.status === "doing"
                    ? "Em andamento"
                    : "A fazer"}
              </Badge>
              <Badge
                variant="outline"
                className={cn(
                  "rounded-full border px-3 py-1",
                  priorityToneClasses[task.priority],
                )}
              >
                {priorityLabels[task.priority]}
              </Badge>
            </div>
            <div>
              <h3 className="text-base font-semibold leading-6 text-foreground">
                {task.title}
              </h3>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {task.description}
              </p>
            </div>
          </div>

          <TaskFormDialog
            task={task}
            trigger={
              <Button type="button" variant="ghost" size="icon" className="rounded-full">
                <Pencil className="size-4" />
                <span className="sr-only">Editar tarefa</span>
              </Button>
            }
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <div className="inline-flex items-center gap-2">
            <CalendarDays className="size-4" />
            <span className={cn(isOverdue && "font-medium text-destructive")}>
              {format(taskDate, "dd 'de' MMM", { locale: ptBR })}
            </span>
          </div>
          {project ? (
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
              {project.name}
            </span>
          ) : null}
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <Avatar className="size-10">
              <AvatarFallback className="bg-accent text-accent-foreground">
                {getInitials(assignee?.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{assignee?.name ?? "Sem responsavel"}</p>
              <p className="truncate text-xs text-muted-foreground">
                {assignee?.email ?? "Atribuicao pendente"}
              </p>
            </div>
          </div>

          {showStatusActions ? (
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="rounded-full"
                disabled={!canMoveBack}
                onClick={() => {
                  if (canMoveBack) {
                    updateTaskStatus(task.id, statusSequence[currentStatusIndex - 1]!);
                  }
                }}
              >
                <ArrowLeft className="size-4" />
                <span className="sr-only">Mover para tras</span>
              </Button>
              <Button
                type="button"
                size="icon"
                className="rounded-full"
                disabled={!canMoveForward}
                onClick={() => {
                  if (canMoveForward) {
                    updateTaskStatus(task.id, statusSequence[currentStatusIndex + 1]!);
                  }
                }}
              >
                <ArrowRight className="size-4" />
                <span className="sr-only">Mover para frente</span>
              </Button>
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
