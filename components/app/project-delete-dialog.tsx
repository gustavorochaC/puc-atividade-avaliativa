"use client";

import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
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
import type { Project } from "@/lib/types";

type ProjectDeleteDialogProps = {
  project: Project;
  trigger?: ReactNode;
  onDeleted?: () => void;
};

export function ProjectDeleteDialog({
  project,
  trigger,
  onDeleted,
}: ProjectDeleteDialogProps) {
  const { state, deleteProject } = useAppStore();
  const [open, setOpen] = useState(false);
  const relatedTasksCount = state.tasks.filter((task) => task.projectId === project.id).length;

  const handleDelete = () => {
    const result = deleteProject(project.id);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    const message =
      result.data?.removedTaskCount && result.data.removedTaskCount > 0
        ? `Projeto excluido com ${result.data.removedTaskCount} tarefa(s) removida(s).`
        : "Projeto excluido.";

    toast.success(message);
    setOpen(false);
    onDeleted?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button type="button" variant="destructive" className="rounded-full">
            <Trash2 className="size-4" />
            Excluir projeto
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Excluir projeto</DialogTitle>
          <DialogDescription>
            {relatedTasksCount > 0
              ? `O projeto "${project.name}" e ${relatedTasksCount} tarefa(s) vinculada(s) serao removidos permanentemente.`
              : `O projeto "${project.name}" sera removido permanentemente.`}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button type="button" variant="destructive" onClick={handleDelete}>
            <Trash2 className="size-4" />
            Confirmar exclusao
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
