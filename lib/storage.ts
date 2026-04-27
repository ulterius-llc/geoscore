import type { StatusRecord } from './types';

const STORAGE_KEY = 'geoscore.records.v1';

export function loadRecords(): StatusRecord {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
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

export function saveRecords(records: StatusRecord): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch {
    // Ignore quota or serialization errors and keep app usable.
  }
}
