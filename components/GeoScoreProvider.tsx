'use client';

import { usePathname } from 'next/navigation';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import i18next, { loadStoredLanguage } from '../lib/i18n';
import { getMap } from '../lib/maps';
import type { MapDef, MapKind } from '../lib/maps/types';
import { loadRecords, saveRecords } from '../lib/storage';
import type { Status, StatusRecord } from '../lib/types';

function pathToMapKind(path: string | null): MapKind {
  if (!path) return 'world';
  if (path === '/us' || path.startsWith('/us/')) return 'us';
  return 'world';
}

interface GeoScoreContextValue {
  ready: boolean;
  map: MapDef;
  records: StatusRecord;
  setStatus: (placeId: string, status: Status) => void;
  clearStatus: (placeId: string) => void;
  replaceAll: (records: StatusRecord) => void;
  resetAll: () => void;
}

const GeoScoreContext = createContext<GeoScoreContextValue | null>(null);

interface GeoScoreProviderProps {
  children: React.ReactNode;
  mapKind?: MapKind;
}

export function GeoScoreProvider({
  children,
  mapKind: explicitKind,
}: GeoScoreProviderProps) {
  const pathname = usePathname();
  const mapKind: MapKind = explicitKind ?? pathToMapKind(pathname);
  const map = useMemo(() => getMap(mapKind), [mapKind]);
  const [recordsByMap, setRecordsByMap] = useState<
    Record<MapKind, StatusRecord>
  >({
    world: {},
    us: {},
  });
  const [hydratedMaps, setHydratedMaps] = useState<Record<MapKind, boolean>>({
    world: false,
    us: false,
  });
  const [langReady, setLangReady] = useState(false);

  useEffect(() => {
    if (hydratedMaps[mapKind]) return;
    const loaded = loadRecords(map.storageKey);
    // Hydrate from localStorage once per map kind; SSR has no window.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRecordsByMap((prev) => ({ ...prev, [mapKind]: loaded }));
    setHydratedMaps((prev) => ({ ...prev, [mapKind]: true }));
  }, [mapKind, map.storageKey, hydratedMaps]);

  useEffect(() => {
    const storedLang = loadStoredLanguage();
    if (storedLang && storedLang !== i18next.language) {
      void i18next.changeLanguage(storedLang);
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLangReady(true);
  }, []);

  const ready = hydratedMaps[mapKind] && langReady;
  const records = recordsByMap[mapKind];

  useEffect(() => {
    if (!hydratedMaps[mapKind]) return;
    saveRecords(records, map.storageKey);
  }, [records, hydratedMaps, mapKind, map.storageKey]);

  const setStatus = useCallback(
    (placeId: string, status: Status) => {
      setRecordsByMap((prev) => {
        const current = prev[mapKind];
        if (status === 'never') {
          if (!(placeId in current)) return prev;
          const next = { ...current };
          delete next[placeId];
          return { ...prev, [mapKind]: next };
        }
        if (current[placeId] === status) return prev;
        return { ...prev, [mapKind]: { ...current, [placeId]: status } };
      });
    },
    [mapKind]
  );

  const clearStatus = useCallback(
    (placeId: string) => {
      setRecordsByMap((prev) => {
        const current = prev[mapKind];
        if (!(placeId in current)) return prev;
        const next = { ...current };
        delete next[placeId];
        return { ...prev, [mapKind]: next };
      });
    },
    [mapKind]
  );

  const replaceAll = useCallback(
    (next: StatusRecord) => {
      setRecordsByMap((prev) => ({ ...prev, [mapKind]: { ...next } }));
    },
    [mapKind]
  );

  const resetAll = useCallback(() => {
    setRecordsByMap((prev) => ({ ...prev, [mapKind]: {} }));
  }, [mapKind]);

  const value = useMemo<GeoScoreContextValue>(
    () => ({
      ready,
      map,
      records,
      setStatus,
      clearStatus,
      replaceAll,
      resetAll,
    }),
    [ready, map, records, setStatus, clearStatus, replaceAll, resetAll]
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

export function useActiveMap(): MapDef {
  return useGeoScore().map;
}
