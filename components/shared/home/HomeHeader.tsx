'use client';

import { CalendarDays } from 'lucide-react';

interface HomeHeaderProps {
  name?: string;
  onOpenCalendar?: () => void;
}

export function HomeHeader({ name = 'Іван', onOpenCalendar }: HomeHeaderProps) {
  return (
    <header className="flex items-start justify-between gap-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">
          Привіт, {name} <span aria-hidden>👋</span>
        </h1>
        <p className="text-sm text-muted-foreground">Твій прогрес починається з маленьких кроків</p>
      </div>
      <button
        type="button"
        aria-label="Календар"
        onClick={onOpenCalendar}
        className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-card text-muted-foreground transition-colors hover:text-foreground">
        <CalendarDays className="size-5" />
      </button>
    </header>
  );
}
