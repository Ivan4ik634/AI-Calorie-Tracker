'use client';

import {
  MEAL_REMINDERS,
  isNotificationSupported,
  requestNotificationPermission,
  showMealNotification,
} from '@/services/notifications/mealReminders';
import { useSettingsStore } from '@/stores/settingsStore';
import { useEffect, useRef } from 'react';

const CHECK_INTERVAL = 30_000;

/**
 * Fires local meal reminders while the app is open.
 * Tracks which reminders were already sent today to avoid duplicates.
 */
export function useMealReminders() {
  const notifications = useSettingsStore((state) => state.settings.notifications);
  const mealReminders = useSettingsStore((state) => state.settings.mealReminders);
  const sentRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!notifications || !mealReminders || !isNotificationSupported()) return;

    void requestNotificationPermission();

    const check = () => {
      const now = new Date();
      const dayKey = now.toDateString();

      for (const reminder of MEAL_REMINDERS) {
        const key = `${dayKey}-${reminder.id}`;
        if (sentRef.current.has(key)) continue;

        const isDue = now.getHours() === reminder.hour && now.getMinutes() >= reminder.minute;
        if (isDue) {
          sentRef.current.add(key);
          showMealNotification(reminder);
        }
      }
    };

    check();
    const timer = window.setInterval(check, CHECK_INTERVAL);
    return () => window.clearInterval(timer);
  }, [notifications, mealReminders]);
}
