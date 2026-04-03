"use client";

import { useState } from "react";
import { format, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarDays } from "lucide-react";
import { EmptyState } from "@/components/app/empty-state";
import { PageHeading } from "@/components/app/page-heading";
import { TaskCard } from "@/components/app/task-card";
import { TaskFormDialog } from "@/components/app/task-form-dialog";
import { useAppStore } from "@/components/providers/app-provider";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";

export default function CalendarPage() {
  const { state } = useAppStore();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const tasksForDay = state.tasks.filter((task) =>
    isSameDay(new Date(task.dueDate), selectedDate),
  );

  const upcomingTasks = [...state.tasks].sort(
    (a, b) => +new Date(a.dueDate) - +new Date(b.dueDate),
  );

  return (
    <div className="space-y-6">
      <PageHeading
        eyebrow="Agenda"
        title="Calendario de entregas"
        description="Acompanhe prazos, selecione um dia especifico e visualize rapidamente as tarefas previstas."
        action={<TaskFormDialog />}
      />

      <div className="grid gap-6 xl:grid-cols-[430px_minmax(0,1fr)]">
        <Card className="rounded-[30px] border-border/80 bg-card/95 shadow-sm">
          <CardContent className="space-y-5 p-5">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Selecione uma data
              </p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight">
                {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
              </h2>
            </div>

            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => setSelectedDate(date ?? new Date())}
              locale={ptBR}
              modifiers={{
                hasTasks: state.tasks.map((task) => new Date(task.dueDate)),
              }}
              modifiersClassNames={{
                hasTasks:
                  "after:absolute after:bottom-1.5 after:left-1/2 after:size-1.5 after:-translate-x-1/2 after:rounded-full after:bg-primary",
              }}
              className="rounded-[28px] border border-border bg-background p-4"
            />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="rounded-[30px] border-border/80 bg-card/95 shadow-sm">
            <CardContent className="space-y-4 p-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Tarefas do dia
                </p>
                <h2 className="mt-1 text-xl font-semibold tracking-tight">
                  {tasksForDay.length > 0
                    ? `${tasksForDay.length} entrega(s) em ${format(selectedDate, "dd/MM", {
                        locale: ptBR,
                      })}`
                    : "Nenhuma entrega para este dia"}
                </h2>
              </div>

              {tasksForDay.length === 0 ? (
                <EmptyState
                  icon={<CalendarDays className="size-6" />}
                  title="Dia sem tarefas registradas"
                  description="Escolha outra data ou cadastre uma nova tarefa com prazo neste dia."
                  action={<TaskFormDialog />}
                />
              ) : (
                <div className="space-y-4">
                  {tasksForDay.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      project={state.projects.find((item) => item.id === task.projectId)}
                      assignee={state.users.find((item) => item.id === task.assigneeId)}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-[30px] border-border/80 bg-card/95 shadow-sm">
            <CardContent className="space-y-4 p-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Proximos prazos
                </p>
                <h2 className="mt-1 text-xl font-semibold tracking-tight">
                  Panorama rapido
                </h2>
              </div>

              <div className="space-y-3">
                {upcomingTasks.slice(0, 5).map((task) => {
                  const project = state.projects.find((item) => item.id === task.projectId);

                  return (
                    <div
                      key={task.id}
                      className="flex items-center justify-between gap-3 rounded-2xl bg-secondary/70 px-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{task.title}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {project?.name ?? "Projeto"}
                        </p>
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {format(new Date(task.dueDate), "dd/MM", { locale: ptBR })}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
