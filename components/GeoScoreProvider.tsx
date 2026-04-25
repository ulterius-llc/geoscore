'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import i18next, { loadStoredLanguage } from '../lib/i18n';
import type { Status, StatusRecord } from '../lib/types';
import { loadRecords, saveRecords } from '../lib/storage';

interface GeoScoreContextValue {
  ready: boolean;
  records: StatusRecord;
  setStatus: (countryId: string, status: Status) => void;
  clearStatus: (countryId: string) => void;
  replaceAll: (records: StatusRecord) => void;
  resetAll: () => void;
}

const GeoScoreContext = createContext<GeoScoreContextValue | null>(null);

export function GeoScoreProvider({ children }: { children: React.ReactNode }) {
  const [records, setRecords] = useState<StatusRecord>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Hydrate from localStorage once on mount; SSR has no window.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRecords(loadRecords());
    setReady(true);
    const storedLang = loadStoredLanguage();
    if (storedLang && storedLang !== i18next.language) {
      void i18next.changeLanguage(storedLang);
    }
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveRecords(records);
  }, [records, ready]);

  const setStatus = useCallback((countryId: string, status: Status) => {
    setRecords((prev) => {
      if (status === 'never') {
        if (!(countryId in prev)) return prev;
        const next = { ...prev };
        delete next[countryId];
        return next;
      }
      if (prev[countryId] === status) return prev;
      return { ...prev, [countryId]: status };
    });
  }, []);

  const clearStatus = useCallback((countryId: string) => {
    setRecords((prev) => {
      if (!(countryId in prev)) return prev;
      const next = { ...prev };
      delete next[countryId];
      return next;
    });
  }, []);

  const replaceAll = useCallback((next: StatusRecord) => {
    setRecords({ ...next });
  }, []);

  const resetAll = useCallback(() => {
    setRecords({});
  }, []);

  const value = useMemo<GeoScoreContextValue>(
    () => ({ ready, records, setStatus, clearStatus, replaceAll, resetAll }),
    [ready, records, setStatus, clearStatus, replaceAll, resetAll]
  );

  return (
    <GeoScoreContext.Provider value={value}>
      {children}
    </GeoScoreContext.Provider>
  );
}

export function useGeoScore(): GeoScoreContextValue {
  const ctx = useContext(GeoScoreContext);
  if (!ctx) {
    throw new Error('useGeoScore must be used within GeoScoreProvider');
  }
  return ctx;
}
