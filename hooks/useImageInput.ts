import { useCallback, useRef } from 'react';

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Не вдалося прочитати файл'));
    reader.readAsDataURL(file);
  });
}

export function useImageInput(onSelect: (dataUrl: string) => void) {
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const openCamera = useCallback(() => cameraInputRef.current?.click(), []);
  const openGallery = useCallback(() => galleryInputRef.current?.click(), []);

  const handleChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      event.target.value = '';
      if (!file) return;

      try {
        const dataUrl = await readFileAsDataUrl(file);
        onSelect(dataUrl);
      } catch {
        // Reading errors are surfaced by the analysis flow.
      }
    },
    [onSelect],
  );

  return { cameraInputRef, galleryInputRef, openCamera, openGallery, handleChange };
}
