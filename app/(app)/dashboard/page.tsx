"use client";

import Link from "next/link";
import {
  addDays,
  format,
  isBefore,
  isSameDay,
  startOfToday,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  AlertTriangle,
  BriefcaseBusiness,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Target,
  Users2,
} from "lucide-react";
import { DashboardStatusChart } from "@/components/app/dashboard-status-chart";
import { DashboardTasksTable } from "@/components/app/dashboard-tasks-table";
import { PageHeading } from "@/components/app/page-heading";
import { ProjectFormDialog } from "@/components/app/project-form-dialog";
import { TaskFormDialog } from "@/components/app/task-form-dialog";
import { useAppStore } from "@/components/providers/app-provider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { priorityLabels } from "@/lib/task-metadata";

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default function DashboardPage() {
  const { state, currentUser } = useAppStore();
  const today = startOfToday();
  const nextWeek = addDays(today, 7);
  const completedTasks = state.tasks.filter((task) => task.status === "done").length;
  const openTasks = state.tasks.length - completedTasks;
  const overdueTasks = state.tasks.filter(
    (task) => task.status !== "done" && isBefore(new Date(task.dueDate), today),
  );
  const dueTodayTasks = state.tasks.filter(
    (task) => task.status !== "done" && isSameDay(new Date(task.dueDate), today),
  );
  const completionRate =
    state.tasks.length === 0 ? 0 : Math.round((completedTasks / state.tasks.length) * 100);
  const tasksDueThisWeek = state.tasks.filter((task) => {
    const taskDate = new Date(task.dueDate);
    return !isBefore(taskDate, today) && isBefore(taskDate, nextWeek);
  });

  const recentTasks = [...state.tasks]
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, 7);

  const focusTasks = [...state.tasks]
    .filter((task) => task.status !== "done")
    .sort((a, b) => +new Date(a.dueDate) - +new Date(b.dueDate))
    .slice(0, 5);

  const teamSnapshot = state.users
    .map((user) => {
      const assignedTasks = state.tasks.filter((task) => task.assigneeId === user.id);
      const activeTasks = assignedTasks.filter((task) => task.status !== "done").length;
      const deliveries = assignedTasks.filter((task) => task.status === "done").length;

      return {
        ...user,
        activeTasks,
        deliveries,
      };
    })
    .sort((a, b) => b.activeTasks - a.activeTasks)
    .slice(0, 5);

  const summaryCards = [
    {
      title: "Projetos ativos",
      value: state.projects.length,
      description: "frentes abertas no workspace",
      icon: BriefcaseBusiness,
      tone: "bg-gradient-to-br from-card via-card to-accent/70 dark:to-accent/30",
    },
    {
      title: "Tarefas abertas",
      value: openTasks,
      description: "itens ainda em execucao",
      icon: Clock3,
      tone: "bg-gradient-to-br from-card via-card to-secondary/90 dark:to-secondary/35",
    },
    {
      title: "Prazos criticos",
      value: overdueTasks.length + dueTodayTasks.length,
      description: "atrasadas ou vencendo hoje",
      icon: AlertTriangle,
      tone: "bg-gradient-to-br from-card via-card to-rose-500/10 dark:to-rose-500/18",
    },
    {
      title: "Conclusao geral",
      value: `${completionRate}%`,
      description: "entregas finalizadas no backlog",
      icon: Target,
      tone: "bg-gradient-to-br from-card via-card to-emerald-500/10 dark:to-emerald-500/18",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeading
        eyebrow="Visao executiva"
        title={`Dashboard${currentUser ? `, ${currentUser.name.split(" ")[0]}` : ""}`}
        description="Um resumo rapido da operacao para acompanhar projetos, priorizar entregas e agir nas tarefas que precisam de atencao."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <ProjectFormDialog
              trigger={
                <Button variant="outline" className="rounded-full">
                  Novo projeto
                </Button>
              }
            />
            <TaskFormDialog
              trigger={
                <Button className="rounded-full">
                  Nova tarefa
                </Button>
              }
            />
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((item) => {
          const Icon = item.icon;

          return (
            <Card
              key={item.title}
              className={`rounded-[28px] border-border/80 shadow-sm ${item.tone}`}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{item.title}</p>
                    <p className="text-3xl font-semibold tracking-tight text-foreground">
                      {item.value}
                    </p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-background/80 text-foreground shadow-sm">
                    <Icon className="size-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 2xl:grid-cols-[minmax(0,1.45fr)_360px] 2xl:items-start">
        <div className="space-y-6">
          <DashboardStatusChart tasks={state.tasks} />
          <DashboardTasksTable
            tasks={recentTasks}
            users={state.users}
            projects={state.projects}
          />
        </div>

        <div className="space-y-6">
          <Card className="rounded-[28px] border-border/80 bg-card/95 shadow-sm">
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle>Ritmo da operacao</CardTitle>
                  <CardDescription>
                    Indicadores consolidados para acompanhar a entrega.
                  </CardDescription>
                </div>
                <Badge variant="outline" className="rounded-full px-3 py-1">
                  {state.tasks.length} tarefas
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3 rounded-[24px] bg-secondary/70 p-4">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-medium text-foreground">Taxa de conclusao</span>
                  <span className="text-muted-foreground">{completionRate}%</span>
                </div>
                <Progress value={completionRate} className="h-2.5 rounded-full" />
              </div>

              <div className="grid gap-3 sm:grid-cols-3 2xl:grid-cols-1">
                <div className="rounded-[22px] border border-border/80 bg-background/80 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <AlertTriangle className="size-4 text-destructive" />
                    Em risco
                  </div>
                  <p className="mt-2 text-2xl font-semibold tracking-tight">
                    {overdueTasks.length}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    tarefas com prazo vencido
                  </p>
                </div>

                <div className="rounded-[22px] border border-border/80 bg-background/80 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <CalendarClock className="size-4 text-primary" />
                    Hoje
                  </div>
                  <p className="mt-2 text-2xl font-semibold tracking-tight">
                    {dueTodayTasks.length}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    entregas previstas para hoje
                  </p>
                </div>

                <div className="rounded-[22px] border border-border/80 bg-background/80 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <CheckCircle2 className="size-4 text-emerald-600" />
                    Semana
                  </div>
                  <p className="mt-2 text-2xl font-semibold tracking-tight">
                    {tasksDueThisWeek.length}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    tarefas com prazo nos proximos 7 dias
                  </p>
                </div>
              </div>

              <Button asChild variant="outline" className="w-full rounded-full">
                <Link href="/calendario">Abrir calendario de entregas</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-[28px] border-border/80 bg-card/95 shadow-sm">
            <CardHeader>
              <CardTitle>Central de atencao</CardTitle>
              <CardDescription>
                Prioridades imediatas e distribuicao do time em um unico painel.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="prazos" className="gap-5">
                <TabsList className="w-full">
                  <TabsTrigger value="prazos">Prazos</TabsTrigger>
                  <TabsTrigger value="equipe">Equipe</TabsTrigger>
                </TabsList>

                <TabsContent value="prazos" className="space-y-3">
                  {focusTasks.length === 0 ? (
                    <div className="rounded-[24px] border border-dashed border-border bg-background/80 px-4 py-8 text-center text-sm text-muted-foreground">
                      Nenhuma tarefa pendente no momento.
                    </div>
                  ) : (
                    focusTasks.map((task) => {
                      const project = state.projects.find((item) => item.id === task.projectId);
                      const isCritical = isBefore(new Date(task.dueDate), addDays(today, 1));

                      return (
                        <div
                          key={task.id}
                          className="rounded-[22px] border border-border/80 bg-background/80 p-4"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-foreground">
                                {task.title}
                              </p>
                              <p className="mt-1 truncate text-xs text-muted-foreground">
                                {project?.name ?? "Projeto"}
                              </p>
                            </div>
                            <Badge
                              variant={isCritical ? "destructive" : "outline"}
                              className="rounded-full px-3 py-1"
                            >
                              {priorityLabels[task.priority]}
                            </Badge>
                          </div>
                          <div className="mt-3 flex items-center justify-between gap-3 text-sm">
                            <span className="text-muted-foreground">
                              {format(new Date(task.dueDate), "dd 'de' MMM", {
                                locale: ptBR,
                              })}
                            </span>
                            <span className="font-medium text-foreground">
                              {task.status === "todo" ? "A fazer" : "Em andamento"}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </TabsContent>

                <TabsContent value="equipe" className="space-y-3">
                  {teamSnapshot.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between gap-3 rounded-[22px] border border-border/80 bg-background/80 p-4"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <Avatar className="size-10">
                          <AvatarFallback className="bg-accent text-accent-foreground">
                            {getInitials(member.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-foreground">
                            {member.name}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {member.email}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                          <Users2 className="size-3.5" />
                          {member.activeTasks} ativas
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {member.deliveries} entrega(s) concluidas
                        </p>
                      </div>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
