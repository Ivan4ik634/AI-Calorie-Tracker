import { analyzeFood, NotFoodError } from '@/services/ai';
import type { FoodAnalysis, FoodAnalysisStatus } from '@/types';
import { useCallback, useRef, useState } from 'react';

export function useFoodAnalysis() {
  const [status, setStatus] = useState<FoodAnalysisStatus>('idle');
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<FoodAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);
  const lastHint = useRef<string | undefined>(undefined);

  const runAnalysis = useCallback(async (dataUrl: string, hint?: string) => {
    const current = ++requestId.current;
    lastHint.current = hint;
    setStatus('analyzing');
    setError(null);

    try {
      const analysis = await analyzeFood(dataUrl, hint);
      if (current !== requestId.current) return;
      setResult(analysis);
      setStatus('success');
    } catch (err) {
      if (current !== requestId.current) return;
      if (err instanceof NotFoodError) {
        setError(err.message);
        setStatus('not-food');
        return;
      }
      setError('Не вдалося проаналізувати фото. Спробуйте ще раз.');
      setStatus('error');
    }
  }, []);

  // Selecting an image only shows the preview. The user can add a short
  // description and then start the analysis explicitly.
  const selectImage = useCallback((dataUrl: string) => {
    requestId.current += 1;
    lastHint.current = undefined;
    setImage(dataUrl);
    setResult(null);
    setError(null);
    setStatus('preview');
  }, []);

  const analyze = useCallback(
    (hint?: string) => {
      if (image) void runAnalysis(image, hint);
    },
    [image, runAnalysis],
  );

  const retry = useCallback(() => {
    if (image) void runAnalysis(image, lastHint.current);
  }, [image, runAnalysis]);

  const reset = useCallback(() => {
    requestId.current += 1;
    lastHint.current = undefined;
    setStatus('idle');
    setImage(null);
    setResult(null);
    setError(null);
  }, []);

  return { status, image, result, error, selectImage, analyze, retry, reset };
}
