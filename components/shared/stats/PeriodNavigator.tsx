'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PeriodNavigatorProps {
  label: string;
  onPrev: () => void;
  onNext: () => void;
}

export function PeriodNavigator({ label, onPrev, onNext }: PeriodNavigatorProps) {
  return (
    <div className="flex items-center justify-between">
      <button
        type="button"
        aria-label="Попередній період"
        onClick={onPrev}
        className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground">
        <ChevronLeft className="size-5" />
      </button>
      <span className="text-sm font-medium">{label}</span>
      <button
        type="button"
        aria-label="Наступний період"
        onClick={onNext}
        className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground">
        <ChevronRight className="size-5" />
      </button>
    </div>
  );
}
