"use client";

import Link from "next/link";
import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, Mail, WandSparkles } from "lucide-react";
import { toast } from "sonner";
import { AuthShell } from "@/components/app/auth-shell";
import { useAppStore } from "@/components/providers/app-provider";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAppStore();
  const [email, setEmail] = useState("gestor@projeto.com");
  const [password, setPassword] = useState("123456");
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsPending(true);
    const result = login({ email, password });

    if (!result.success) {
      toast.error(result.message);
      setIsPending(false);
      return;
    }

    toast.success("Acesso liberado.");
    startTransition(() => {
      router.replace("/dashboard");
      setIsPending(false);
    });
  };

  return (
    <AuthShell
      title="Entrar no sistema"
      description="Acesse o ambiente para acompanhar projetos, atualizar tarefas e navegar pela nova interface baseada em componentes shadcn/ui."
      footer={
        <p>
          Ainda nao tem acesso?{" "}
          <Link href="/cadastro" className="font-medium text-foreground underline underline-offset-4">
            Criar conta
          </Link>
        </p>
      }
    >
      <form className="grid gap-6" onSubmit={handleSubmit}>
        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">E-mail</FieldLabel>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="seuemail@empresa.com"
                  className="pl-9"
                />
              </div>
            </Field>

            <Field>
              <FieldLabel htmlFor="password">Senha</FieldLabel>
              <div className="relative">
                <KeyRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Digite sua senha"
                  className="pl-9"
                />
              </div>
              <FieldDescription>
                Para testes rapidos, voce pode usar o acesso demo ja preenchido.
              </FieldDescription>
            </Field>
          </FieldGroup>
        </FieldSet>

        <div className="grid gap-3">
          <Button type="submit" size="lg" className="rounded-2xl" disabled={isPending}>
            {isPending ? "Entrando..." : "Entrar"}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="rounded-2xl"
            onClick={() => {
              setEmail("gestor@projeto.com");
              setPassword("123456");
              toast.success("Credenciais demo aplicadas.");
            }}
          >
            <WandSparkles className="size-4" />
            Usar acesso demo
          </Button>
        </div>
      </form>
    </AuthShell>
  );
}
