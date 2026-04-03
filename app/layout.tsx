import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AppProvider } from "@/components/providers/app-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sistema Gerenciador de Tarefas",
  description: "MVP funcional para gestao de projetos, tarefas, kanban e calendario.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <TooltipProvider>
          <AppProvider>{children}</AppProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
