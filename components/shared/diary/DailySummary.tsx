'use client';

import { Progress } from '@/components/ui/progress';

interface DailySummaryProps {
  consumed: number;
  goal: number;
}

export function DailySummary({ consumed, goal }: DailySummaryProps) {
  const percent = goal > 0 ? Math.min((consumed / goal) * 100, 100) : 0;

  return (
    <section className="space-y-3 rounded-2xl border border-border/60 bg-card p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Калорії</span>
        <span className="text-sm text-muted-foreground">
          {consumed} / {goal} ккал
        </span>
      </div>
      <Progress value={percent} />
    </section>
  );
}
