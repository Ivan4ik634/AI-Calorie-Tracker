'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoaderCircle, Send } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface FoodPreviewProps {
  image: string;
  isLoading?: boolean;
  /** Called with the optional dish description when the user submits. */
  onAnalyze?: (hint: string) => void;
}

export function FoodPreview({ image, isLoading = false, onAnalyze }: FoodPreviewProps) {
  const [hint, setHint] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onAnalyze?.(hint.trim());
  };

  return (
    <div className="space-y-4">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-muted">
        <Image src={image} alt="Обране фото" fill unoptimized className="object-cover" />
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/60 backdrop-blur-sm">
            <LoaderCircle className="size-8 animate-spin text-primary" />
            <p className="text-sm font-medium">Аналізуємо фото...</p>
            <p className="text-xs text-muted-foreground">Це може зайняти кілька секунд</p>
          </div>
        )}
      </div>

      {!isLoading && onAnalyze && (
        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">
              Що це за страва? (необов'язково)
            </label>
            <Input
              value={hint}
              onChange={(event) => setHint(event.target.value)}
              placeholder="Напр. борщ зі сметаною"
              className="h-11 rounded-xl text-base"
            />
            <p className="text-xs text-muted-foreground">
              Опишіть страву, щоб AI точніше визначив калорійність.
            </p>
          </div>
          <Button type="submit" className="h-12 w-full gap-2 rounded-xl text-base">
            <Send className="size-4" />
            Відправити
          </Button>
        </form>
      )}
    </div>
  );
}
