"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/app/app-shell";
import { useAppStore } from "@/components/providers/app-provider";

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const { ready, currentUser } = useAppStore();

  useEffect(() => {
    if (!ready || currentUser) {
      return;
    }

    router.replace("/login");
  }, [currentUser, ready, router]);

  if (!ready || !currentUser) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="rounded-full border border-border bg-card px-5 py-2 text-sm text-muted-foreground shadow-sm">
          Validando sessao...
        </div>
      </main>
    );
  }

  return <AppShell>{children}</AppShell>;
}
