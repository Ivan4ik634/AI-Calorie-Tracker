export interface MealReminder {
  id: 'breakfast' | 'snack' | 'lunch' | 'dinner';
  hour: number;
  minute: number;
  title: string;
  body: string;
}

/**
 * Daily meal reminder schedule. Times are local to the device.
 * Breakfast 8-10, lunch 14-16, dinner ~20, plus a snack in between.
 */
export const MEAL_REMINDERS: MealReminder[] = [
  {
    id: 'breakfast',
    hour: 9,
    minute: 0,
    title: 'Час снідати',
    body: 'Не забудьте записати сніданок у щоденник.',
  },
  {
    id: 'snack',
    hour: 12,
    minute: 0,
    title: 'Перекус',
    body: 'Легкий перекус допоможе підтримати енергію.',
  },
  {
    id: 'lunch',
    hour: 15,
    minute: 0,
    title: 'Час обідати',
    body: 'Запишіть обід, щоб бачити свій прогрес.',
  },
  {
    id: 'dinner',
    hour: 20,
    minute: 0,
    title: 'Час вечеряти',
    body: 'Не забудьте додати вечерю до щоденника.',
  },
];

export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!isNotificationSupported()) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;

  const permission = await Notification.requestPermission();
  return permission === 'granted';
}

export function showMealNotification(reminder: MealReminder): void {
  if (!isNotificationSupported() || Notification.permission !== 'granted') return;

  new Notification(reminder.title, {
    body: reminder.body,
    icon: '/favicon.ico',
    tag: `meal-${reminder.id}`,
  });
}
