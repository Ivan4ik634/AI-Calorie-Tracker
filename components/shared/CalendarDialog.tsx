'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogBackdrop,
  DialogPopup,
  DialogPortal,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  WEEKDAY_SHORT,
  dayjs,
  formatMonthLabel,
  getMonthGrid,
  isSameDay,
  isSameMonth,
  isToday,
  toDayKey,
} from '@/lib/date';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface CalendarDialogProps {
  open: boolean;
  selected: Date;
  onOpenChange: (open: boolean) => void;
  onSelect: (date: Date) => void;
}

export function CalendarDialog({ open, selected, onOpenChange, onSelect }: CalendarDialogProps) {
  const [viewMonth, setViewMonth] = useState(() => dayjs(selected).startOf('month'));

  const days = getMonthGrid(viewMonth);

  const handleSelect = (date: Date) => {
    onSelect(date);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup>
          <DialogTitle>Оберіть дату</DialogTitle>

          <div className="flex items-center justify-between">
            <button
              type="button"
              aria-label="Попередній місяць"
              onClick={() => setViewMonth((month) => month.subtract(1, 'month'))}
              className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground">
              <ChevronLeft className="size-5" />
            </button>
            <span className="text-sm font-semibold capitalize">{formatMonthLabel(viewMonth)}</span>
            <button
              type="button"
              aria-label="Наступний місяць"
              onClick={() => setViewMonth((month) => month.add(1, 'month'))}
              className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground">
              <ChevronRight className="size-5" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {WEEKDAY_SHORT.map((label) => (
              <span key={label} className="py-1 text-xs font-medium text-muted-foreground">
                {label}
              </span>
            ))}
            {days.map((day) => {
              const isSelected = isSameDay(day, selected);
              const inMonth = isSameMonth(day, viewMonth);
              return (
                <button
                  key={toDayKey(day)}
                  type="button"
                  onClick={() => handleSelect(day.toDate())}
                  className={cn(
                    'flex aspect-square items-center justify-center rounded-lg text-sm transition-colors',
                    isSelected
                      ? 'bg-primary font-semibold text-primary-foreground'
                      : inMonth
                        ? 'text-foreground hover:bg-muted/60'
                        : 'text-muted-foreground/40 hover:bg-muted/40',
                    !isSelected && isToday(day) && 'ring-1 ring-primary/60',
                  )}>
                  {day.format('D')}
                </button>
              );
            })}
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => handleSelect(new Date())}
            className="h-11 w-full rounded-xl">
            Сьогодні
          </Button>
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  );
}
