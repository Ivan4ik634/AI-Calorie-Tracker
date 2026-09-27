'use client';

import { Camera, ChevronRight } from 'lucide-react';

interface AddFoodCardProps {
  onClick: () => void;
}

export function AddFoodCard({ onClick }: AddFoodCardProps) {
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold text-muted-foreground">Сьогодні</h2>
      <button
        type="button"
        onClick={onClick}
        className="flex w-full items-center gap-3 rounded-2xl border border-border/60 bg-card p-3 text-left transition-colors hover:bg-muted/40">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <Camera className="size-5" />
        </span>
        <span className="flex-1">
          <span className="block text-sm font-semibold">Зробити фото</span>
          <span className="block text-xs text-muted-foreground">AI проаналізує їжу</span>
        </span>
        <ChevronRight className="size-5 text-muted-foreground" />
      </button>
    </section>
  );
}
