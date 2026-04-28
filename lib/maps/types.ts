import type { Status } from '../types';

export type MapKind = 'world' | 'us';

export interface Place {
  id: string;
  code: string;
  name_ja: string;
  name_en: string;
  group: string;
  subgroup: string;
}

export interface ProjectionConfig {
  name: string;
  config: Record<string, number | number[]>;
  width: number;
  height: number;
  preserveAspectRatio: string;
}

export interface ViewConfig {
  initialZoomMobile: number;
  initialZoomDesktop: number;
  initialCenterMobile: [number, number];
  initialCenterDesktop: [number, number];
  initialCenterMobileJa?: [number, number];
  minZoom: number;
  maxZoom: number;
  translateExtent: [[number, number], [number, number]];
}

export interface MapDef {
  kind: MapKind;
  storageKey: string;
  geographyUrl: string;
  places: Place[];
  placeById: Map<string, Place>;
  groups: string[];
  subgroupsByGroup: Record<string, string[]>;
  placesBySubgroup: Record<string, Place[]>;
  placesByGroup: Record<string, Place[]>;
  groupKeyPrefix: string;
  subgroupKeyPrefix: string;
  statusKeyPrefix: string;
  resolveId: (
    geoId: string | undefined,
    geoName: string | undefined
  ) => string | null;
  projection: ProjectionConfig;
  view: ViewConfig;
  shareProjection: ProjectionConfig;
  /** ISO numeric or FIPS codes that exist as topojson features */
  hasGeometry: (placeId: string) => boolean;
}

export type ScoreSnapshot = {
  total: number;
  max: number;
  visited: number;
  totalPlaces: number;
  byStatus: Record<Status, number>;
};
