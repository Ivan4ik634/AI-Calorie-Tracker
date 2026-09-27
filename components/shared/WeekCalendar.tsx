'use client';

import { WEEKDAY_SHORT, formatDayNumber, getWeekDays, isSameDay, toDayKey } from '@/lib/date';
import { cn } from '@/lib/utils';

interface WeekCalendarProps {
  selected: string | Date;
  onSelect: (date: Date) => void;
}

export function WeekCalendar({ selected, onSelect }: WeekCalendarProps) {
  const days = getWeekDays(selected);

  return (
    <div className="grid grid-cols-7 gap-1">
      {days.map((day, index) => {
        const isActive = isSameDay(day, selected);
        return (
          <button
            key={toDayKey(day)}
            type="button"
            onClick={() => onSelect(day.toDate())}
            className={cn(
              'flex flex-col items-center gap-1 rounded-xl py-2 text-xs transition-colors',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted/50',
            )}>
            <span className="font-medium">{WEEKDAY_SHORT[index]}</span>
            <span className={cn('text-sm font-semibold', isActive && 'text-primary-foreground')}>
              {formatDayNumber(day)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
