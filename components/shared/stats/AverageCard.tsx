'use client';

import { Flame } from 'lucide-react';

interface AverageCardProps {
  average: number;
}

export function AverageCard({ average }: AverageCardProps) {
  return (
    <section className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-4">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
        <Flame className="size-5" />
      </span>
      <div>
        <p className="text-xs text-muted-foreground">Середнє за день</p>
        <p className="text-xl font-bold">{average} ккал</p>
      </div>
    </section>
  );
}
