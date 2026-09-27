'use client';

import { CalendarDays } from 'lucide-react';

interface DiaryHeaderProps {
  title?: string;
  onOpenCalendar?: () => void;
}

export function DiaryHeader({ title = 'Щоденник', onOpenCalendar }: DiaryHeaderProps) {
  return (
    <header className="flex items-center justify-between gap-4">
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
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
