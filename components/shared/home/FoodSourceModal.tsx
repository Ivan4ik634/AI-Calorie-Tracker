'use client';

import { Button } from '@/components/ui/button';
import { Camera, Image as ImageIcon } from 'lucide-react';

interface FoodSourceModalProps {
  onCamera: () => void;
  onGallery: () => void;
}

export function FoodSourceModal({ onCamera, onGallery }: FoodSourceModalProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Додати їжу</h2>
        <p className="text-sm text-muted-foreground">Оберіть джерело зображення</p>
      </div>
      <div className="space-y-2">
        <Button
          type="button"
          onClick={onCamera}
          className="h-12 w-full justify-start gap-3 rounded-xl text-base">
          <Camera className="size-5" />
          Зробити фото
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onGallery}
          className="h-12 w-full justify-start gap-3 rounded-xl text-base">
          <ImageIcon className="size-5" />
          Обрати з галереї
        </Button>
      </div>
    </div>
  );
}
