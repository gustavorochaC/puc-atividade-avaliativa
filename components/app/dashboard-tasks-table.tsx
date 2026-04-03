"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarClock, FolderKanban, Pencil, UserRound } from "lucide-react";
import { TaskFormDialog } from "@/components/app/task-form-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { priorityLabels, priorityToneClasses, statusLabels, statusToneClasses } from "@/lib/task-metadata";
import { cn } from "@/lib/utils";
import type { Project, Task, User } from "@/lib/types";

type DashboardTasksTableProps = {
  tasks: Task[];
  users: User[];
  projects: Project[];
};

export function DashboardTasksTable({
  tasks,
  users,
  projects,
}: DashboardTasksTableProps) {
  return (
    <Card className="rounded-[28px] border-border/80 bg-card/95 shadow-sm">
      <CardHeader>
        <CardTitle>Tarefas recentes</CardTitle>
        <CardDescription>
          Lista consolidada para revisao rapida e edicao direta.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {tasks.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-border bg-background/70 px-4 py-10 text-center text-sm text-muted-foreground">
            Nenhuma tarefa registrada ainda.
          </div>
        ) : (
          <>
            <div className="grid gap-3 lg:hidden">
              {tasks.map((task) => {
                const user = users.find((item) => item.id === task.assigneeId);
                const project = projects.find((item) => item.id === task.projectId);

                return (
                  <div
                    key={task.id}
                    className="space-y-4 rounded-[24px] border border-border/80 bg-background/70 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 space-y-1">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {task.title}
                        </p>
                        <p className="text-xs leading-5 text-muted-foreground">
                          {task.description}
                        </p>
                      </div>
                      <TaskFormDialog
                        task={task}
                        trigger={
                          <Button variant="ghost" size="icon-sm" className="rounded-full">
                            <Pencil className="size-4" />
                            <span className="sr-only">Editar tarefa</span>
                          </Button>
                        }
                      />
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant="outline"
                        className={cn("rounded-full border px-3 py-1", statusToneClasses[task.status])}
                      >
                        {statusLabels[task.status]}
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

                    <div className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-3">
                      <div className="flex items-center gap-2">
                        <FolderKanban className="size-3.5" />
                        <span className="truncate">{project?.name ?? "Projeto"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <UserRound className="size-3.5" />
                        <span className="truncate">{user?.name ?? "Sem responsavel"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CalendarClock className="size-3.5" />
                        <span>
                          {format(new Date(task.dueDate), "dd/MM/yyyy", { locale: ptBR })}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="hidden overflow-x-auto lg:block">
              <Table className="min-w-[760px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Tarefa</TableHead>
                    <TableHead>Projeto</TableHead>
                    <TableHead>Responsavel</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Prioridade</TableHead>
                    <TableHead>Prazo</TableHead>
                    <TableHead className="text-right">Acao</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map((task) => {
                    const user = users.find((item) => item.id === task.assigneeId);
                    const project = projects.find((item) => item.id === task.projectId);

                    return (
                      <TableRow key={task.id}>
                        <TableCell className="max-w-[240px]">
                          <div className="space-y-1">
                            <p className="truncate font-medium text-foreground">{task.title}</p>
                            <p className="truncate text-xs text-muted-foreground">
                              {task.description}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{project?.name ?? "Projeto"}</TableCell>
                        <TableCell>{user?.name ?? "Sem responsavel"}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={cn("rounded-full border px-3 py-1", statusToneClasses[task.status])}
                          >
                            {statusLabels[task.status]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={cn(
                              "rounded-full border px-3 py-1",
                              priorityToneClasses[task.priority],
                            )}
                          >
                            {priorityLabels[task.priority]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {format(new Date(task.dueDate), "dd/MM/yyyy", { locale: ptBR })}
                        </TableCell>
                        <TableCell className="text-right">
                          <TaskFormDialog
                            task={task}
                            trigger={
                              <Button variant="ghost" size="icon-sm" className="rounded-full">
                                <Pencil className="size-4" />
                                <span className="sr-only">Editar tarefa</span>
                              </Button>
                            }
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
