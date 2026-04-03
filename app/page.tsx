"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/components/providers/app-provider";

export default function HomePage() {
  const router = useRouter();
  const { ready, currentUser } = useAppStore();

  useEffect(() => {
    if (!ready) {
      return;
    }

    router.replace(currentUser ? "/dashboard" : "/login");
  }, [currentUser, ready, router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-transparent">
      <div className="rounded-full border border-border bg-card px-5 py-2 text-sm text-muted-foreground shadow-sm">
        Carregando sistema...
      </div>
    </main>
  );
}
