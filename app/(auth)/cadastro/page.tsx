"use client";

import Link from "next/link";
import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, Mail, UserRound } from "lucide-react";
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

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAppStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.error("Preencha nome, e-mail e senha.");
      return;
    }

    setIsPending(true);
    const result = register({ name, email, password });

    if (!result.success) {
      toast.error(result.message);
      setIsPending(false);
      return;
    }

    toast.success("Conta criada com sucesso.");
    startTransition(() => {
      router.replace("/dashboard");
      setIsPending(false);
    });
  };

  return (
    <AuthShell
      title="Criar conta"
      description="Cadastre um usuario local para testar autenticacao, acesso ao dashboard e operacao completa do MVP."
      footer={
        <p>
          Ja possui conta?{" "}
          <Link href="/login" className="font-medium text-foreground underline underline-offset-4">
            Fazer login
          </Link>
        </p>
      }
    >
      <form className="grid gap-6" onSubmit={handleSubmit}>
        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Nome completo</FieldLabel>
              <div className="relative">
                <UserRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Seu nome"
                  className="pl-9"
                />
              </div>
            </Field>

            <Field>
              <FieldLabel htmlFor="email">E-mail</FieldLabel>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="nome@empresa.com"
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
                  placeholder="Crie uma senha simples para o MVP"
                  className="pl-9"
                />
              </div>
              <FieldDescription>
                Como este e um MVP local, uma senha simples ja resolve para demonstracao.
              </FieldDescription>
            </Field>
          </FieldGroup>
        </FieldSet>

        <Button type="submit" size="lg" className="rounded-2xl" disabled={isPending}>
          {isPending ? "Criando conta..." : "Cadastrar"}
        </Button>
      </form>
    </AuthShell>
  );
}
