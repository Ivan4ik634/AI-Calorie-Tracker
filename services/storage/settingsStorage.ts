import type { AppSettings } from '@/types';
import { readJson, writeJson } from './localStorage';

const SETTINGS_KEY = 'calorie-counter:app-settings';

export const DEFAULT_SETTINGS: AppSettings = {
  units: 'metric',
  darkTheme: true,
  notifications: true,
  mealReminders: true,
};

export const settingsStorage = {
  load(): AppSettings {
    return readJson<AppSettings>(SETTINGS_KEY, DEFAULT_SETTINGS);
  },
  save(settings: AppSettings): void {
    writeJson(SETTINGS_KEY, settings);
  },
};
