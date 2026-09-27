'use client';

import {
  isPushSupported,
  subscribeToPush,
  unsubscribeFromPush,
} from '@/services/notifications/webPush';
import { useProfileStore } from '@/stores/profileStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { useEffect, useRef } from 'react';

/**
 * Keeps the browser push subscription in sync with the user's settings.
 * Subscribes once onboarding is complete and notifications are enabled,
 * and unsubscribes when the user turns them off.
 */
export function usePushNotifications() {
  const onboarded = useProfileStore((state) => state.profile.onboarded);
  const notifications = useSettingsStore((state) => state.settings.notifications);
  const mealReminders = useSettingsStore((state) => state.settings.mealReminders);
  const enabled = notifications && mealReminders;
  const syncedRef = useRef<boolean | null>(null);

  useEffect(() => {
    if (!onboarded || !isPushSupported()) return;
    if (syncedRef.current === enabled) return;
    syncedRef.current = enabled;

    if (enabled) {
      // Browsers may block the permission prompt without a user gesture.
      // The settings "Тестове сповіщення" button re-subscribes on click.
      void subscribeToPush().then((result) => {
        if (!result.ok) console.warn('[push] auto-subscribe failed:', result.error);
      });
    } else {
      void unsubscribeFromPush();
    }
  }, [onboarded, enabled]);
}
