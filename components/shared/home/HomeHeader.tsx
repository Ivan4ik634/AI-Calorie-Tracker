'use client';

import { CalendarDays } from 'lucide-react';
import Image from 'next/image';

interface HomeHeaderProps {
  name?: string;
  onOpenCalendar?: () => void;
}

export function HomeHeader({ name = 'Іван', onOpenCalendar }: HomeHeaderProps) {
  return (
    <header className="flex items-start justify-between gap-4">
      <div className="flex items-center gap-3">
        <Image
          src="/logo-remove-bg.png"
          alt="Calorie Tracker"
          width={44}
          height={44}
          className="size-11 shrink-0 rounded-xl"
          priority
        />
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">
            Привіт, {name} <span aria-hidden>👋</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Твій прогрес починається з маленьких кроків
          </p>
        </div>
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
