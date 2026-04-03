"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/components/providers/app-provider";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const { ready, currentUser } = useAppStore();

  useEffect(() => {
    if (!ready || !currentUser) {
      return;
    }

    router.replace("/dashboard");
  }, [currentUser, ready, router]);

  if (!ready || currentUser) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="rounded-full border border-border bg-card px-5 py-2 text-sm text-muted-foreground shadow-sm">
          Preparando acesso...
        </div>
      </main>
    );
  }

  return children;
}
