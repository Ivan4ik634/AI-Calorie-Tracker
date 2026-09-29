'use client';

import type { NutritionValues } from '@/components/shared/NutritionFields';
import { NutritionFields } from '@/components/shared/NutritionFields';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { analysisToEditable } from '@/lib/nutrition';
import type { FoodAnalysis } from '@/types';
import {
  Camera,
  CircleAlert,
  Image as ImageIcon,
  RefreshCw,
  Sparkles,
  UtensilsCrossed,
} from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface FoodAnalysisResultProps {
  image: string;
  result: FoodAnalysis;
  onConfirm: (values: NutritionValues & { name: string }) => void;
  onRetry: () => void;
}

export function FoodAnalysisResult({ image, result, onConfirm, onRetry }: FoodAnalysisResultProps) {
  // The component remounts for every new analysis (it is unmounted while the
  // "analyzing" preview is shown), so initialising from `result` is enough.
  const [name, setName] = useState(result.name);
  const [values, setValues] = useState<NutritionValues>(() => analysisToEditable(result));

  const handleConfirm = () => {
    onConfirm({ ...values, name: name.trim() || result.name });
  };

  return (
    <div className="space-y-4">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-muted">
        <Image src={image} alt={name} fill unoptimized className="object-cover" />
      </div>

      <div className="flex items-center gap-2 text-sm text-primary">
        <Sparkles className="size-4" />
        <span>AI розпізнав їжу — перевірте та за потреби відредагуйте</span>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs text-muted-foreground">Назва страви</label>
        <Input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Назва"
          className="h-11 rounded-xl text-base"
        />
      </div>

      <NutritionFields values={values} onChange={setValues} />

      <div className="space-y-2 pt-1">
        <Button type="button" onClick={handleConfirm} className="h-12 w-full rounded-xl text-base">
          Додати до щоденника
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={onRetry}
          className="h-11 w-full gap-2 rounded-xl text-muted-foreground">
          <RefreshCw className="size-4" />
          Спробувати ще раз
        </Button>
      </div>
    </div>
  );
}

interface FoodAnalysisErrorProps {
  message: string;
  onRetry: () => void;
}

export function FoodAnalysisError({ message, onRetry }: FoodAnalysisErrorProps) {
  return (
    <div className="space-y-4 py-4 text-center">
      <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-destructive/15 text-destructive">
        <CircleAlert className="size-7" />
      </div>
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Помилка аналізу</h2>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
      <Button type="button" onClick={onRetry} className="h-12 w-full gap-2 rounded-xl text-base">
        <RefreshCw className="size-4" />
        Спробувати ще раз
      </Button>
    </div>
  );
}

interface FoodNotDetectedProps {
  message: string;
  onCamera: () => void;
  onGallery: () => void;
}

export function FoodNotDetected({ message, onCamera, onGallery }: FoodNotDetectedProps) {
  return (
    <div className="space-y-5 py-4 text-center">
      <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-amber-500/15 text-amber-500">
        <UtensilsCrossed className="size-7" />
      </div>
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Це не схоже на їжу</h2>
        <p className="text-sm text-muted-foreground">{message}</p>
        <p className="text-xs text-muted-foreground">
          Спробуйте сфотографувати страву або оберіть інше фото з галереї.
        </p>
      </div>
      <div className="space-y-2">
        <Button
          type="button"
          onClick={onCamera}
          className="h-12 w-full justify-center gap-3 rounded-xl text-base">
          <Camera className="size-5" />
          Зробити нове фото
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onGallery}
          className="h-12 w-full justify-center gap-3 rounded-xl text-base">
          <ImageIcon className="size-5" />
          Обрати з галереї
        </Button>
      </div>
    </div>
  );
}
