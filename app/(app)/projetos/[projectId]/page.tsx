"use client";

import Link from "next/link";
import { use } from "react";
import { useRouter } from "next/navigation";
import { format, isPast } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  Clock3,
  FolderKanban,
  Layers3,
  Users2,
} from "lucide-react";
import { EmptyState } from "@/components/app/empty-state";
import { PageHeading } from "@/components/app/page-heading";
import { ProjectDeleteDialog } from "@/components/app/project-delete-dialog";
import { ProjectFormDialog } from "@/components/app/project-form-dialog";
import { TaskCard } from "@/components/app/task-card";
import { TaskFormDialog } from "@/components/app/task-form-dialog";
import { useAppStore } from "@/components/providers/app-provider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type ProjectDetailsPageProps = {
  params: Promise<{
    projectId: string;
  }>;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default function ProjectDetailsPage({ params }: ProjectDetailsPageProps) {
  const router = useRouter();
  const { projectId } = use(params);
  const { state } = useAppStore();
  const project = state.projects.find((item) => item.id === projectId);

  if (!project) {
    return (
      <div className="space-y-6">
        <PageHeading
          eyebrow="Projetos"
          title="Projeto nao encontrado"
          description="Esse projeto nao esta mais disponivel no workspace atual."
          action={
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/projetos">
                <ArrowLeft className="size-4" />
                Voltar para projetos
              </Link>
            </Button>
          }
        />

        <EmptyState
          icon={<FolderKanban className="size-6" />}
          title="Nao encontramos esse projeto"
          description="Volte para a listagem de projetos ativos e escolha outra iniciativa para acompanhar."
          action={
            <Button asChild className="rounded-full">
              <Link href="/projetos">Abrir projetos</Link>
            </Button>
          }
        />
      </div>
    );
  }

  const tasks = state.tasks
    .filter((task) => task.projectId === project.id)
    .sort((a, b) => +new Date(a.dueDate) - +new Date(b.dueDate));
  const members = state.users.filter((user) => project.memberIds.includes(user.id));
  const completedTasks = tasks.filter((task) => task.status === "done").length;
  const openTasks = tasks.length - completedTasks;
  const progress = tasks.length === 0 ? 0 : Math.round((completedTasks / tasks.length) * 100);
  const overdueTasks = tasks.filter(
    (task) => task.status !== "done" && isPast(new Date(task.dueDate)),
  );
  const dueDate = new Date(project.dueDate);

  return (
    <div className="space-y-6">
      <PageHeading
        eyebrow="Projetos ativos"
        title={project.name}
        description={project.description}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/projetos">
                <ArrowLeft className="size-4" />
                Voltar
              </Link>
            </Button>
            <ProjectFormDialog
              project={project}
              trigger={
                <Button type="button" variant="outline" className="rounded-full">
                  Editar projeto
                </Button>
              }
            />
            <ProjectDeleteDialog
              project={project}
              onDeleted={() => router.push("/projetos")}
              trigger={
                <Button type="button" variant="destructive" className="rounded-full">
                  Excluir projeto
                </Button>
              }
            />
            <TaskFormDialog
              defaultProjectId={project.id}
              trigger={
                <Button type="button" className="rounded-full">
                  Nova tarefa
                </Button>
              }
            />
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="rounded-[28px] border-border/80 bg-card/95 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Andamento</p>
                <p className="text-3xl font-semibold tracking-tight">{progress}%</p>
                <p className="text-sm text-muted-foreground">percentual concluido</p>
              </div>
              <div className="flex size-11 items-center justify-center rounded-2xl bg-secondary/75">
                <CheckCircle2 className="size-5" />
              </div>
            </div>
            <Progress value={progress} className="mt-4 h-2.5 rounded-full" />
          </CardContent>
        </Card>

        <Card className="rounded-[28px] border-border/80 bg-card/95 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Tarefas abertas</p>
                <p className="text-3xl font-semibold tracking-tight">{openTasks}</p>
                <p className="text-sm text-muted-foreground">itens em execucao ou pendentes</p>
              </div>
              <div className="flex size-11 items-center justify-center rounded-2xl bg-secondary/75">
                <Layers3 className="size-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[28px] border-border/80 bg-card/95 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Equipe</p>
                <p className="text-3xl font-semibold tracking-tight">{members.length}</p>
                <p className="text-sm text-muted-foreground">membro(s) neste projeto</p>
              </div>
              <div className="flex size-11 items-center justify-center rounded-2xl bg-secondary/75">
                <Users2 className="size-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[28px] border-border/80 bg-card/95 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Prazo final</p>
                <p className="text-2xl font-semibold tracking-tight">
                  {format(dueDate, "dd/MM", { locale: ptBR })}
                </p>
                <p className="text-sm text-muted-foreground">
                  {format(dueDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </p>
              </div>
              <div className="flex size-11 items-center justify-center rounded-2xl bg-secondary/75">
                <CalendarClock className="size-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_360px] xl:items-start">
        <Card className="rounded-[28px] border-border/80 bg-card/95 shadow-sm">
          <CardHeader className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle>Tarefas do projeto</CardTitle>
                <CardDescription>
                  Acompanhe o backlog completo dessa iniciativa e atualize as entregas.
                </CardDescription>
              </div>
              <Badge variant="outline" className="rounded-full px-3 py-1">
                {tasks.length} tarefa(s)
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {tasks.length === 0 ? (
              <EmptyState
                icon={<Clock3 className="size-6" />}
                title="Nenhuma tarefa cadastrada"
                description="Crie a primeira tarefa para comecar a acompanhar as entregas deste projeto."
                action={<TaskFormDialog defaultProjectId={project.id} />}
              />
            ) : (
              <div className="grid gap-4">
                {tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    project={project}
                    assignee={state.users.find((user) => user.id === task.assigneeId)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="rounded-[28px] border-border/80 bg-card/95 shadow-sm">
            <CardHeader>
              <CardTitle>Resumo do projeto</CardTitle>
              <CardDescription>
                Indicadores rapidos para entender o momento atual da entrega.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-[24px] bg-secondary/75 p-4">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-medium">Progresso geral</span>
                  <span className="text-muted-foreground">{progress}%</span>
                </div>
                <Progress value={progress} className="mt-3 h-2.5 rounded-full" />
              </div>

              <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                <div className="rounded-[22px] border border-border/80 bg-background/80 p-4">
                  <p className="text-sm font-medium text-foreground">Concluidas</p>
                  <p className="mt-2 text-2xl font-semibold tracking-tight">{completedTasks}</p>
                  <p className="mt-1 text-sm text-muted-foreground">tarefas finalizadas</p>
                </div>

                <div className="rounded-[22px] border border-border/80 bg-background/80 p-4">
                  <p className="text-sm font-medium text-foreground">Pendentes</p>
                  <p className="mt-2 text-2xl font-semibold tracking-tight">{openTasks}</p>
                  <p className="mt-1 text-sm text-muted-foreground">tarefas ainda abertas</p>
                </div>

                <div className="rounded-[22px] border border-border/80 bg-background/80 p-4">
                  <p className="text-sm font-medium text-foreground">Em risco</p>
                  <p className="mt-2 text-2xl font-semibold tracking-tight">
                    {overdueTasks.length}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">tarefas com prazo vencido</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[28px] border-border/80 bg-card/95 shadow-sm">
            <CardHeader>
              <CardTitle>Equipe alocada</CardTitle>
              <CardDescription>
                Pessoas envolvidas diretamente nessa frente de trabalho.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {members.length === 0 ? (
                <div className="rounded-[22px] border border-dashed border-border bg-background/75 px-4 py-8 text-center text-sm text-muted-foreground">
                  Nenhum membro vinculado a este projeto.
                </div>
              ) : (
                <div className="space-y-3">
                  {members.map((member) => {
                    const assignedTasks = tasks.filter((task) => task.assigneeId === member.id);
                    const completedByMember = assignedTasks.filter(
                      (task) => task.status === "done",
                    ).length;

                    return (
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

                        <div className="text-right text-xs text-muted-foreground">
                          <p>{assignedTasks.length} tarefa(s)</p>
                          <p>{completedByMember} concluida(s)</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
