"use client";

import { FolderKanban } from "lucide-react";
import { EmptyState } from "@/components/app/empty-state";
import { PageHeading } from "@/components/app/page-heading";
import { ProjectCard } from "@/components/app/project-card";
import { ProjectFormDialog } from "@/components/app/project-form-dialog";
import { useAppStore } from "@/components/providers/app-provider";

export default function ProjectsPage() {
  const { state } = useAppStore();

  return (
    <div className="space-y-6">
      <PageHeading
        eyebrow="Organizacao"
        title="Projetos"
        description="Cadastre frentes de trabalho, vincule membros e acompanhe o progresso de cada iniciativa."
        action={<ProjectFormDialog />}
      />

      {state.projects.length === 0 ? (
        <EmptyState
          icon={<FolderKanban className="size-6" />}
          title="Nenhum projeto cadastrado"
          description="Crie o primeiro projeto para comecar a distribuir tarefas e visualizar o progresso."
          action={<ProjectFormDialog />}
        />
      ) : (
        <div className="grid gap-5 xl:grid-cols-2">
          {state.projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              tasks={state.tasks.filter((task) => task.projectId === project.id)}
              members={state.users.filter((user) => project.memberIds.includes(user.id))}
            />
          ))}
        </div>
      )}
    </div>
  );
}
