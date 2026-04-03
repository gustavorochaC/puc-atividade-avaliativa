import type { ReactNode } from "react";
import { ModeToggle } from "@/components/app/mode-toggle";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type AuthShellProps = {
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
};

export function AuthShell({
  title,
  description,
  children,
  footer,
}: AuthShellProps) {
  return (
    <main className="relative flex min-h-screen items-center justify-center px-4 py-8">
      <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
        <ModeToggle />
      </div>

      <div className="w-full max-w-lg">
        <Card className="w-full rounded-[32px] border-border/80 bg-card/92 shadow-xl shadow-black/5 backdrop-blur dark:shadow-black/30">
          <CardContent className="p-6 sm:p-8">
            <div className="space-y-4 text-center">
              <div className="flex justify-center">
                <Badge variant="secondary" className="rounded-full px-3 py-1">
                  Sistema Gerenciador de Tarefas
                </Badge>
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  {title}
                </h1>
                <p className="text-sm leading-6 text-muted-foreground">{description}</p>
              </div>
            </div>

            <div className="mt-8">{children}</div>
            <Separator className="my-6" />
            <div className="text-sm text-muted-foreground">{footer}</div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
