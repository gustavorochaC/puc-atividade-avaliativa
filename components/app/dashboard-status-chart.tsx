"use client";

import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { Task } from "@/lib/types";

type DashboardStatusChartProps = {
  tasks: Task[];
};

const chartConfig = {
  value: {
    label: "Tarefas",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const statusMeta = {
  todo: {
    label: "A fazer",
    fill: "var(--chart-3)",
  },
  doing: {
    label: "Em andamento",
    fill: "var(--chart-1)",
  },
  done: {
    label: "Concluido",
    fill: "var(--chart-2)",
  },
};

export function DashboardStatusChart({ tasks }: DashboardStatusChartProps) {
  const data = (Object.keys(statusMeta) as Array<keyof typeof statusMeta>).map((key) => ({
    status: key,
    label: statusMeta[key].label,
    value: tasks.filter((task) => task.status === key).length,
    fill: statusMeta[key].fill,
  }));

  return (
    <Card className="self-start rounded-[28px] border-border/80 bg-card/95 shadow-sm">
      <CardHeader>
        <CardTitle>Carga por etapa</CardTitle>
        <CardDescription>
          Distribuicao atual das tarefas dentro do fluxo operacional.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[190px] w-full sm:h-[220px] xl:h-[240px]">
          <BarChart data={data} accessibilityLayer>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={10} />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="value" radius={14}>
              {data.map((entry) => (
                <Cell key={entry.status} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
