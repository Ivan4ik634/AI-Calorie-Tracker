import { idbClear } from './indexedDb';
import { removeKey } from './localStorage';

const ALL_KEYS = [
  'calorie-counter:food-entries',
  'calorie-counter:daily-goals',
  'calorie-counter:user-profile',
  'calorie-counter:app-settings',
];

/** Wipes every persisted key owned by the app (localStorage + IndexedDB). */
export async function clearAllAppData(): Promise<void> {
  ALL_KEYS.forEach(removeKey);
  try {
    await idbClear();
  } catch {
    // IndexedDB may be unavailable — localStorage keys are already cleared.
  }
}
