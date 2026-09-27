'use client';

import { LoaderCircle } from 'lucide-react';
import Image from 'next/image';

interface FoodPreviewProps {
  image: string;
  isLoading?: boolean;
}

export function FoodPreview({ image, isLoading = false }: FoodPreviewProps) {
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
    </div>
  );
}
