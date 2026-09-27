'use client';

import { NutritionFields } from '@/components/shared/NutritionFields';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogBackdrop,
  DialogPopup,
  DialogPortal,
  DialogTitle,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { formatFullDate, formatTime } from '@/lib/date';
import type { EditableNutrition } from '@/lib/nutrition';
import { entryToEditable } from '@/lib/nutrition';
import type { FoodEntry } from '@/types';
import { Trash, Utensils } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface MealDetailDialogProps {
  entry: FoodEntry | null;
  onOpenChange: (open: boolean) => void;
  onSave: (id: string, values: EditableNutrition & { eaten: boolean }) => void;
  onDelete: (id: string) => void;
}

export function MealDetailDialog({ entry, onOpenChange, onSave, onDelete }: MealDetailDialogProps) {
  const [values, setValues] = useState<EditableNutrition | null>(null);
  const [eaten, setEaten] = useState(true);

  useEffect(() => {
    if (!entry) return;
    setValues(entryToEditable(entry));
    setEaten(entry.eaten);
  }, [entry]);

  const handleSave = () => {
    if (!entry || !values) return;
    onSave(entry.id, { ...values, eaten });
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (!entry) return;
    onDelete(entry.id);
    onOpenChange(false);
  };

  return (
    <Dialog open={Boolean(entry)} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup className="max-h-[90dvh] overflow-y-auto">
          {entry && values && (
            <>
              <DialogTitle className="sr-only">{entry.name}</DialogTitle>

              <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-muted">
                {entry.image ? (
                  <Image
                    src={entry.image}
                    alt={entry.name}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <span className="flex h-full items-center justify-center">
                    <Utensils className="size-10 text-muted-foreground" />
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <h2 className="text-xl font-bold">{entry.name}</h2>
                <p className="text-xs text-muted-foreground">
                  {formatFullDate(entry.createdAt)} · {formatTime(entry.createdAt)}
                </p>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card px-4 py-3">
                <span className="flex-1 text-sm font-medium">З&apos;їдено</span>
                <Switch checked={eaten} onCheckedChange={setEaten} />
              </div>

              <NutritionFields values={values} onChange={setValues} />

              <div className="space-y-2 pt-1">
                <Button
                  type="button"
                  onClick={handleSave}
                  className="h-12 w-full rounded-xl text-base">
                  Зберегти
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleDelete}
                  className="h-11 w-full gap-2 rounded-xl text-destructive hover:text-destructive">
                  <Trash className="size-4" />
                  Видалити запис
                </Button>
              </div>
            </>
          )}
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  );
}
