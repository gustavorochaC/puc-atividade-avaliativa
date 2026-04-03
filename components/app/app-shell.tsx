"use client";

import { CalendarDays } from "lucide-react";
import { AppBreadcrumbs } from "@/components/app/app-breadcrumbs";
import { AppSidebar } from "@/components/app/app-sidebar";
import { ModeToggle } from "@/components/app/mode-toggle";
import { TaskFormDialog } from "@/components/app/task-form-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-border/70 bg-background/92 px-4 backdrop-blur lg:px-6">
          <div className="flex min-w-0 items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <AppBreadcrumbs />
          </div>

          <div className="flex items-center gap-2">
            <ModeToggle />
            <Badge variant="outline" className="hidden rounded-full px-3 py-1 sm:inline-flex">
              <CalendarDays className="mr-1 size-3.5" />
              Estrutura shadcn
            </Badge>
            <TaskFormDialog
              trigger={
                <Button className="rounded-full px-4">
                  Nova tarefa
                </Button>
              }
            />
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-6 p-4 lg:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
