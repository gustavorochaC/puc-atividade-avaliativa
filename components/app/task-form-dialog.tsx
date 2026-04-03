"use client";

import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Pencil, Plus } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { priorityLabels, statusLabels } from "@/lib/task-metadata";
import type { Task, TaskPriority, TaskStatus } from "@/lib/types";

type TaskFormDialogProps = {
  task?: Task;
  trigger?: ReactNode;
  defaultProjectId?: string;
};

function createDefaultState(defaultProjectId?: string) {
  return {
    title: "",
    description: "",
    projectId: defaultProjectId ?? "",
    assigneeId: "",
    priority: "medium" as TaskPriority,
    status: "todo" as TaskStatus,
    dueDate: "",
  };
}

export function TaskFormDialog({
  task,
  trigger,
  defaultProjectId,
}: TaskFormDialogProps) {
  const { state, upsertTask } = useAppStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(createDefaultState(defaultProjectId));

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      if (task) {
        setForm({
          title: task.title,
          description: task.description,
          projectId: task.projectId,
          assigneeId: task.assigneeId,
          priority: task.priority,
          status: task.status,
          dueDate: task.dueDate.slice(0, 10),
        });
      } else {
        setForm(createDefaultState(defaultProjectId));
      }
    }

    setOpen(nextOpen);
  };

  const handleSubmit = () => {
    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.projectId ||
      !form.assigneeId ||
      !form.dueDate
    ) {
      toast.error("Preencha todos os campos da tarefa.");
      return;
    }

    const result = upsertTask({
      id: task?.id,
      title: form.title,
      description: form.description,
      projectId: form.projectId,
      assigneeId: form.assigneeId,
      priority: form.priority,
      status: form.status,
      dueDate: new Date(`${form.dueDate}T12:00:00`).toISOString(),
    });

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(task ? "Tarefa atualizada." : "Tarefa criada.");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button className="rounded-2xl">
            {task ? <Pencil className="size-4" /> : <Plus className="size-4" />}
            {task ? "Editar tarefa" : "Nova tarefa"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{task ? "Editar tarefa" : "Criar tarefa"}</DialogTitle>
          <DialogDescription>
            Registre o responsavel, prioridade, status e prazo da entrega.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5">
          <div className="grid gap-2">
            <Label htmlFor="task-title">Titulo</Label>
            <Input
              id="task-title"
              value={form.title}
              onChange={(event) =>
                setForm((current) => ({ ...current, title: event.target.value }))
              }
              placeholder="Ex.: Revisar quadro de tarefas"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="task-description">Descricao</Label>
            <Textarea
              id="task-description"
              rows={5}
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              placeholder="Detalhe o objetivo ou o proximo passo da tarefa."
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Projeto</Label>
              <Select
                value={form.projectId}
                onValueChange={(value) =>
                  setForm((current) => ({ ...current, projectId: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um projeto" />
                </SelectTrigger>
                <SelectContent>
                  {state.projects.map((projectOption) => (
                    <SelectItem key={projectOption.id} value={projectOption.id}>
                      {projectOption.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Responsavel</Label>
              <Select
                value={form.assigneeId}
                onValueChange={(value) =>
                  setForm((current) => ({ ...current, assigneeId: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um membro" />
                </SelectTrigger>
                <SelectContent>
                  {state.users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="grid gap-2">
              <Label>Prioridade</Label>
              <Select
                value={form.priority}
                onValueChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    priority: value as TaskPriority,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Prioridade" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(priorityLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    status: value as TaskStatus,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="task-due-date">Prazo</Label>
              <Input
                id="task-due-date"
                type="date"
                value={form.dueDate}
                onChange={(event) =>
                  setForm((current) => ({ ...current, dueDate: event.target.value }))
                }
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleSubmit}>
            {task ? "Salvar alteracoes" : "Criar tarefa"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
