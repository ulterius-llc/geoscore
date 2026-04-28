import type { StatusRecord } from './types';

export const DEFAULT_STORAGE_KEY = 'geoscore.records.v1';

export function loadRecords(
  storageKey: string = DEFAULT_STORAGE_KEY
): StatusRecord {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as StatusRecord;
    }
    return {};
  } catch {
    return {};
  }
}

export function saveRecords(
  records: StatusRecord,
  storageKey: string = DEFAULT_STORAGE_KEY
): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(records));
  } catch {
    // Ignore quota or serialization errors and keep app usable.
  }
}
