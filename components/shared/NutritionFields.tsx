'use client';

import { Input } from '@/components/ui/input';
import type { EditableNutrition } from '@/lib/nutrition';
import { calcPortion } from '@/lib/nutrition';
import { cn } from '@/lib/utils';
import { useId } from 'react';

export type NutritionValues = EditableNutrition;

interface NutritionFieldsProps {
  values: NutritionValues;
  onChange: (values: NutritionValues) => void;
  className?: string;
}

const MACROS = [
  { key: 'protein', label: 'Білки', color: 'text-emerald-400' },
  { key: 'fat', label: 'Жири', color: 'text-amber-400' },
  { key: 'carbs', label: 'Вуглеводи', color: 'text-violet-400' },
] as const;

const toNumber = (value: string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
};

export function NutritionFields({ values, onChange, className }: NutritionFieldsProps) {
  // Stable ids keep the browser from autofilling these numeric fields.
  const id = useId();

  const update = (key: keyof NutritionValues, raw: string) => {
    onChange({ ...values, [key]: toNumber(raw) });
  };

  // When the user edits the portion weight, rescale every value from the
  // per-100g source (120 g -> ×1.2, etc.).
  const updateGrams = (raw: string) => {
    const grams = toNumber(raw);
    if (values.per100g) {
      onChange({ ...values, grams, ...calcPortion(values.per100g, grams) });
    } else {
      onChange({ ...values, grams });
    }
  };

  return (
    <div className={cn('space-y-3', className)}>
      <div className="grid grid-cols-2 gap-3">
        <label className="space-y-1.5">
          <span className="text-xs text-muted-foreground">Калорії</span>
          <div className="flex items-center gap-1.5">
            <Input
              type="number"
              autoComplete="off"
              name={`${id}-calories`}
              inputMode="numeric"
              value={values.calories}
              onChange={(event) => update('calories', event.target.value)}
              className="h-11 rounded-xl text-base"
            />
            <span className="text-xs text-muted-foreground">ккал</span>
          </div>
        </label>
        <label className="space-y-1.5">
          <span className="text-xs text-muted-foreground">Вага</span>
          <div className="flex items-center gap-1.5">
            <Input
              type="number"
              autoComplete="off"
              name={`${id}-grams`}
              inputMode="numeric"
              value={values.grams ?? ''}
              placeholder="—"
              onChange={(event) => updateGrams(event.target.value)}
              className="h-11 rounded-xl text-base"
            />
            <span className="text-xs text-muted-foreground">г</span>
          </div>
        </label>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {MACROS.map(({ key, label, color }) => (
          <label key={key} className="space-y-1.5">
            <span className={cn('text-xs font-medium', color)}>{label}</span>
            <div className="flex items-center gap-1">
              <Input
                type="number"
                autoComplete="off"
                name={`${id}-${key}`}
                inputMode="numeric"
                value={values[key]}
                onChange={(event) => update(key, event.target.value)}
                className="h-11 rounded-xl text-base"
              />
              <span className="text-xs text-muted-foreground">г</span>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
