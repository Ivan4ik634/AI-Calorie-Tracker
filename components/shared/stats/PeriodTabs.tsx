'use client';

import { cn } from '@/lib/utils';

export type StatsPeriod = 'week' | 'month' | 'year';

const PERIODS: { id: StatsPeriod; label: string }[] = [
  { id: 'week', label: 'Тиждень' },
  { id: 'month', label: 'Місяць' },
  { id: 'year', label: 'Рік' },
];

interface PeriodTabsProps {
  value: StatsPeriod;
  onChange: (period: StatsPeriod) => void;
}

export function PeriodTabs({ value, onChange }: PeriodTabsProps) {
  return (
    <div className="flex gap-1 rounded-xl bg-muted/50 p-1">
      {PERIODS.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          className={cn(
            'flex-1 rounded-lg py-2 text-sm font-medium transition-colors',
            value === id
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground',
          )}>
          {label}
        </button>
      ))}
    </div>
  );
}
