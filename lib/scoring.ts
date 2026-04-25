import type { Status } from './types';

export const STATUS_ORDER: Status[] = [
  'live',
  'stay',
  'visit',
  'transit',
  'never',
];

export const SCORE_MAP: Record<Status, number> = {
  live: 4,
  stay: 3,
  visit: 2,
  transit: 1,
  never: 0,
};

// Single coherent palette: cool greens for "settled", sky for "passing through",
// amber accent for the brief transit touch, neutral slate for unvisited.
export const STATUS_COLORS: Record<Status, string> = {
  live: '#0f766e',
  stay: '#5eead4',
  visit: '#0ea5e9',
  transit: '#f59e0b',
  never: '#e2e8f0',
};

export const STATUS_DARK_COLORS: Record<Status, string> = {
  live: '#2dd4bf',
  stay: '#99f6e4',
  visit: '#7dd3fc',
  transit: '#fcd34d',
  never: '#1f2937',
};

export function nextStatus(current: Status | undefined): Status {
  const order: Status[] = ['never', 'transit', 'visit', 'stay', 'live'];
  const idx = order.indexOf(current ?? 'never');
  return order[(idx + 1) % order.length];
}
