import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarRange, CheckCircle2, ChevronRight, Layers3, Users2 } from "lucide-react";
import { ProjectDeleteDialog } from "@/components/app/project-delete-dialog";
import { ProjectFormDialog } from "@/components/app/project-form-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Project, Task, User } from "@/lib/types";

type ProjectCardProps = {
  project: Project;
  tasks: Task[];
  members: User[];
};

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function ProjectCard({ project, tasks, members }: ProjectCardProps) {
  const finishedTasks = tasks.filter((task) => task.status === "done").length;
  const progress = tasks.length === 0 ? 0 : Math.round((finishedTasks / tasks.length) * 100);

  return (
    <Card className="group relative rounded-[28px] border-border/80 bg-card/95 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      <Link
        href={`/projetos/${project.id}`}
        aria-label={`Ver detalhes do projeto ${project.name}`}
        className="absolute inset-0 z-10 rounded-[28px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
      />
      <CardContent className="space-y-5 p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <Badge variant="outline" className="rounded-full px-3 py-1">
              Projeto ativo
            </Badge>
            <div>
              <h3 className="text-lg font-semibold tracking-tight">{project.name}</h3>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {project.description}
              </p>
            </div>
          </div>

          <div className="relative z-20 flex items-center gap-2">
            <ProjectFormDialog
              project={project}
              trigger={
                <Button type="button" variant="outline" className="rounded-full">
                  Editar
                </Button>
              }
            />
            <ProjectDeleteDialog
              project={project}
              trigger={
                <Button type="button" variant="destructive" className="rounded-full">
                  Excluir
                </Button>
              }
            />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-secondary/80 p-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <CalendarRange className="size-4" />
              Prazo
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {format(new Date(project.dueDate), "dd 'de' MMMM", { locale: ptBR })}
            </p>
          </div>
          <div className="rounded-2xl bg-secondary/80 p-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Layers3 className="size-4" />
              Tarefas
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{tasks.length} registradas</p>
          </div>
          <div className="rounded-2xl bg-secondary/80 p-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <CheckCircle2 className="size-4" />
              Concluidas
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {finishedTasks} finalizadas
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Andamento</span>
            <span className="text-muted-foreground">{progress}% concluido</span>
          </div>
          <Progress value={progress} className="h-2.5 rounded-full" />
        </div>

        <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/80 bg-background/70 p-4">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium">
              <Users2 className="size-4" />
              Equipe do projeto
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {members.length} membro(s) alocados
            </p>
          </div>

          <div className="flex -space-x-3">
            {members.map((member) => (
              <Avatar key={member.id} className="size-10 border-2 border-background">
                <AvatarFallback className="bg-accent text-accent-foreground">
                  {getInitials(member.name)}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl bg-secondary/65 px-4 py-3 text-sm font-medium text-foreground">
          <span>Ver detalhes do projeto</span>
          <ChevronRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
        </div>
      </CardContent>
    </Card>
  );
}
