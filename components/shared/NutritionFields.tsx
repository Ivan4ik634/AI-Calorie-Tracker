'use client';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export interface NutritionValues {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  grams?: number;
}

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
  const update = (key: keyof NutritionValues, raw: string) => {
    onChange({ ...values, [key]: toNumber(raw) });
  };

  return (
    <div className={cn('space-y-3', className)}>
      <div className="grid grid-cols-2 gap-3">
        <label className="space-y-1.5">
          <span className="text-xs text-muted-foreground">Калорії</span>
          <div className="flex items-center gap-1.5">
            <Input
              type="number"
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
              inputMode="numeric"
              value={values.grams ?? ''}
              placeholder="—"
              onChange={(event) => update('grams', event.target.value)}
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
