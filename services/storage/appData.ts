import { removeKey } from './localStorage';

const ALL_KEYS = [
  'calorie-counter:food-entries',
  'calorie-counter:daily-goals',
  'calorie-counter:user-profile',
  'calorie-counter:app-settings',
];

/** Wipes every persisted key owned by the app. */
export function clearAllAppData(): void {
  ALL_KEYS.forEach(removeKey);
}
