/**
 * Downscales and re-encodes an image so it fits comfortably in localStorage.
 * Phone photos are several megabytes as base64, which blows the ~5 MB quota
 * after one or two entries. Resizing to a max edge of 1024 px and encoding as
 * JPEG keeps each photo around 50-150 KB while staying sharp enough for the
 * AI analysis and the in-app preview.
 */
export async function compressImage(
  dataUrl: string,
  maxEdge = 1024,
  quality = 0.75,
): Promise<string> {
  if (typeof document === 'undefined') return dataUrl;

  try {
    const image = await loadImage(dataUrl);
    const scale = Math.min(1, maxEdge / Math.max(image.width, image.height));
    const width = Math.max(1, Math.round(image.width * scale));
    const height = Math.max(1, Math.round(image.height * scale));

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');
    if (!context) return dataUrl;

    context.drawImage(image, 0, 0, width, height);
    return canvas.toDataURL('image/jpeg', quality);
  } catch {
    // If anything fails, fall back to the original image.
    return dataUrl;
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Не вдалося завантажити зображення'));
    image.src = src;
  });
}
