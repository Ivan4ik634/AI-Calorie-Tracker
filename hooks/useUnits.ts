'use client';

import { WEIGHT_UNIT_LABEL, fromDisplayWeight, toDisplayWeight } from '@/lib/units';
import { useSettingsStore } from '@/stores/settingsStore';

/**
 * Maps the app's stored metric values to the units chosen in settings.
 * Body weight is kept in kg internally and converted on display/save.
 */
export function useUnits() {
  const units = useSettingsStore((state) => state.settings.units);

  return {
    units,
    weightUnit: WEIGHT_UNIT_LABEL[units],
    toDisplayWeight: (kg: number) => toDisplayWeight(kg, units),
    fromDisplayWeight: (value: number) => fromDisplayWeight(value, units),
  };
}
