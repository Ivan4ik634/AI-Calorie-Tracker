'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogBackdrop,
  DialogPopup,
  DialogPortal,
  DialogTitle,
} from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { UnitSystem } from '@/types';

const UNIT_OPTIONS: { value: UnitSystem; label: string; hint: string }[] = [
  { value: 'metric', label: 'Метрична', hint: 'Кілограми, грами, ккал' },
  { value: 'imperial', label: 'Імперська', hint: 'Фунти, унції, ккал' },
];

interface UnitsDialogProps {
  open: boolean;
  value: UnitSystem;
  onOpenChange: (open: boolean) => void;
  onSave: (value: UnitSystem) => void;
}

export function UnitsDialog({ open, value, onOpenChange, onSave }: UnitsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup>
          <DialogTitle>Одиниці вимірювання</DialogTitle>
          <RadioGroup
            value={value}
            onValueChange={(next) => onSave(next as UnitSystem)}
            className="gap-0 divide-y divide-border/50 rounded-2xl border border-border/60 bg-card px-4">
            {UNIT_OPTIONS.map((option) => (
              <label key={option.value} className="flex cursor-pointer items-center gap-3 py-3.5">
                <RadioGroupItem value={option.value} />
                <span className="flex-1">
                  <span className="block text-sm font-medium">{option.label}</span>
                  <span className="block text-xs text-muted-foreground">{option.hint}</span>
                </span>
              </label>
            ))}
          </RadioGroup>
          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            className="h-11 w-full rounded-xl">
            Готово
          </Button>
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  );
}
