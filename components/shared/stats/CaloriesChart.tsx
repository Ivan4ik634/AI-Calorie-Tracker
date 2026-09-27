'use client';

import type { ChartConfig } from '@/components/ui/chart';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

export interface ChartPoint {
  label: string;
  sublabel?: string;
  value: number;
}

interface CaloriesChartProps {
  data: ChartPoint[];
}

const chartConfig = {
  value: {
    label: 'Калорії',
    color: 'var(--primary)',
  },
} satisfies ChartConfig;

export function CaloriesChart({ data }: CaloriesChartProps) {
  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-52 w-full">
      <BarChart data={data} margin={{ top: 8, right: 4, left: -20, bottom: 0 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tick={{ fontSize: 11 }}
        />
        <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} width={40} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <Bar dataKey="value" fill="var(--color-value)" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ChartContainer>
  );
}
