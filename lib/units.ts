import type { UnitSystem } from '@/types';

export const KG_TO_LB = 2.2046226218;

export const kgToLb = (kg: number) => kg * KG_TO_LB;
export const lbToKg = (lb: number) => lb / KG_TO_LB;

const round1 = (value: number) => Math.round(value * 10) / 10;

/** Body weight is always stored in kg; convert for display when needed. */
export function toDisplayWeight(kg: number, units: UnitSystem): number {
  return units === 'imperial' ? round1(kgToLb(kg)) : kg;
}

/** Convert a user-entered weight back to the stored kg value. */
export function fromDisplayWeight(value: number, units: UnitSystem): number {
  return units === 'imperial' ? round1(lbToKg(value)) : value;
}

export const WEIGHT_UNIT_LABEL: Record<UnitSystem, string> = {
  metric: 'кг',
  imperial: 'фунт',
};
