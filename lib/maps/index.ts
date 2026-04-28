import type { MapDef, MapKind } from './types';
import { US_MAP } from './us';
import { WORLD_MAP } from './world';

export const MAPS: Record<MapKind, MapDef> = {
  world: WORLD_MAP,
  us: US_MAP,
};

export function getMap(kind: MapKind): MapDef {
  return MAPS[kind];
}

export type { MapDef, MapKind, Place } from './types';
