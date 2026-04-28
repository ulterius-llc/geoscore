'use client';

import { useTranslation } from 'react-i18next';
import type { MapDef } from '../lib/maps/types';
import type { Status } from '../lib/types';
import { useActiveMap } from './GeoScoreProvider';

export function statusLabelKey(status: Status, map: MapDef): string[] {
  if (map.statusKeyPrefix === 'status') return [`status.${status}`];
  return [`${map.statusKeyPrefix}.${status}`, `status.${status}`];
}

export function useStatusLabel(): (status: Status) => string {
  const { t } = useTranslation();
  const map = useActiveMap();
  return (status: Status) => t(statusLabelKey(status, map));
}
