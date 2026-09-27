import { MEAL_REMINDERS } from './mealReminders';

const DEVICE_ID_KEY = 'calorie-counter:device-id';

/** Returns a stable anonymous device id, creating one on first use. */
export function getDeviceId(): string {
  if (typeof window === 'undefined') return '';
  let id = window.localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}

export function isPushSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  );
}

function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const output = new Uint8Array(new ArrayBuffer(rawData.length));
  for (let i = 0; i < rawData.length; i += 1) {
    output[i] = rawData.charCodeAt(i);
  }
  return output;
}

async function registerServiceWorker(): Promise<ServiceWorkerRegistration> {
  return navigator.serviceWorker.register('/sw.js', {
    scope: '/',
    updateViaCache: 'none',
  });
}

/** Requests permission, subscribes the browser and stores it on the server. */
export async function subscribeToPush(): Promise<{ ok: boolean; error?: string }> {
  if (!isPushSupported()) {
    return { ok: false, error: 'Цей браузер не підтримує сповіщення.' };
  }

  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  if (!publicKey) {
    return { ok: false, error: 'Не налаштовано публічний VAPID-ключ.' };
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      return { ok: false, error: 'Дозвіл на сповіщення не надано.' };
    }

    const registration = await registerServiceWorker();
    await navigator.serviceWorker.ready;

    const existing = await registration.pushManager.getSubscription();
    const subscription =
      existing ??
      (await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      }));

    const response = await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deviceId: getDeviceId(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        reminders: MEAL_REMINDERS.map((reminder) => reminder.id),
        subscription: subscription.toJSON(),
      }),
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      return { ok: false, error: data?.error ?? 'Не вдалося зберегти підписку.' };
    }

    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Невідома помилка';
    return { ok: false, error: `Помилка підписки: ${message}` };
  }
}

/** Unsubscribes the browser and removes the subscription from the server. */
export async function unsubscribeFromPush(): Promise<void> {
  if (!isPushSupported()) return;

  const registration = await navigator.serviceWorker.getRegistration();
  const subscription = await registration?.pushManager.getSubscription();
  if (!subscription) return;

  const endpoint = subscription.endpoint;
  await subscription.unsubscribe();

  await fetch('/api/push/subscribe', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ endpoint }),
  });
}

/**
 * Sends an immediate test notification to this device.
 * Ensures the device is subscribed first (the click counts as a user gesture,
 * which browsers require before showing the permission prompt).
 * Returns an error message when it fails, or null on success.
 */
export async function sendTestNotification(): Promise<string | null> {
  if (!isPushSupported()) {
    return 'Цей браузер не підтримує сповіщення.';
  }

  const subscribed = await subscribeToPush();
  if (!subscribed.ok) {
    return subscribed.error ?? 'Не вдалося підписатися на сповіщення.';
  }

  const response = await fetch('/api/push/test', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ deviceId: getDeviceId() }),
  });

  if (response.ok) return null;

  const data = (await response.json().catch(() => null)) as { error?: string } | null;
  return data?.error ?? 'Не вдалося надіслати сповіщення.';
}
