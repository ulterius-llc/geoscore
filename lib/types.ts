export type Status = 'live' | 'stay' | 'visit' | 'transit' | 'never';

export type Region =
  | 'east_asia'
  | 'southeast_asia'
  | 'south_asia'
  | 'central_asia'
  | 'middle_east'
  | 'northern_europe'
  | 'western_europe'
  | 'southern_europe'
  | 'eastern_europe'
  | 'north_africa'
  | 'west_africa'
  | 'central_africa'
  | 'east_africa'
  | 'southern_africa'
  | 'north_america'
  | 'central_america'
  | 'south_america'
  | 'oceania'
  | 'antarctica';

export type Continent =
  | 'asia'
  | 'europe'
  | 'africa'
  | 'north_america'
  | 'central_america'
  | 'south_america'
  | 'oceania'
  | 'antarctica';

export interface Country {
  id: string;
  iso_a3: string;
  name_ja: string;
  name_en: string;
  region: Region;
}

export type StatusRecord = Record<string, Status>;

export interface ExportPayload {
  app: 'geoscore';
  version: 1;
  exportedAt: string;
  records: StatusRecord;
}
