"use client";

import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Check, Pencil, Plus } from "lucide-react";
import { useAppStore } from "@/components/providers/app-provider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/types";

type ProjectFormDialogProps = {
  project?: Project;
  trigger?: ReactNode;
};

function createDefaultState(currentUserId?: string) {
  return {
    name: "",
    description: "",
    dueDate: "",
    memberIds: currentUserId ? [currentUserId] : [],
  };
}

export function ProjectFormDialog({
  project,
  trigger,
}: ProjectFormDialogProps) {
  const { state, currentUser, upsertProject } = useAppStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(createDefaultState(currentUser?.id));

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      if (project) {
        setForm({
          name: project.name,
          description: project.description,
          dueDate: project.dueDate.slice(0, 10),
          memberIds: project.memberIds,
        });
      } else {
        setForm(createDefaultState(currentUser?.id));
      }
    }

    setOpen(nextOpen);
  };

  const toggleMember = (memberId: string) => {
    setForm((current) => ({
      ...current,
      memberIds: current.memberIds.includes(memberId)
        ? current.memberIds.filter((id) => id !== memberId)
        : [...current.memberIds, memberId],
    }));
  };

  const handleSubmit = () => {
    if (!form.name.trim() || !form.description.trim() || !form.dueDate) {
      toast.error("Preencha nome, descricao e prazo do projeto.");
      return;
    }

    if (form.memberIds.length === 0) {
      toast.error("Selecione pelo menos um membro para o projeto.");
      return;
    }

    const result = upsertProject({
      id: project?.id,
      name: form.name,
      description: form.description,
      dueDate: new Date(`${form.dueDate}T18:00:00`).toISOString(),
      memberIds: form.memberIds,
    });

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(project ? "Projeto atualizado." : "Projeto criado.");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button className="rounded-2xl">
            {project ? <Pencil className="size-4" /> : <Plus className="size-4" />}
            {project ? "Editar projeto" : "Novo projeto"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{project ? "Editar projeto" : "Criar projeto"}</DialogTitle>
          <DialogDescription>
            Defina nome, descricao, prazo e membros envolvidos no acompanhamento.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5">
          <div className="grid gap-2">
            <Label htmlFor="project-name">Nome do projeto</Label>
            <Input
              id="project-name"
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({ ...current, name: event.target.value }))
              }
              placeholder="Ex.: Portal interno"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="project-description">Descricao</Label>
            <Textarea
              id="project-description"
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              placeholder="Descreva a finalidade e a meta principal do projeto."
              rows={5}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="project-due-date">Prazo final</Label>
            <Input
              id="project-due-date"
              type="date"
              value={form.dueDate}
              onChange={(event) =>
                setForm((current) => ({ ...current, dueDate: event.target.value }))
              }
            />
          </div>

          <div className="grid gap-3">
            <Label>Membros do projeto</Label>
            <div className="grid gap-3 sm:grid-cols-2">
              {state.users.map((user) => {
                const active = form.memberIds.includes(user.id);

                return (
                  <button
                    key={user.id}
                    type="button"
                    className={cn(
                      "flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition-colors",
                      active
                        ? "border-primary bg-primary/8 text-primary"
                        : "border-border bg-background hover:border-primary/40 hover:bg-accent/60",
                    )}
                    onClick={() => toggleMember(user.id)}
                  >
                    <div>
                      <p className="font-medium text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    {active ? <Check className="size-4" /> : null}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleSubmit}>
            {project ? "Salvar alteracoes" : "Criar projeto"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
