import {
  CONTINENT_ORDER,
  COUNTRIES,
  COUNTRIES_BY_CONTINENT,
  COUNTRIES_BY_REGION,
  COUNTRY_BY_ID,
  REGION_TO_CONTINENT,
  REGIONS_BY_CONTINENT,
  resolveCountryId,
} from '../countries';
import type { Country } from '../types';
import type { MapDef, Place } from './types';

function toPlace(country: Country): Place {
  return {
    id: country.id,
    code: country.iso_a3,
    name_ja: country.name_ja,
    name_en: country.name_en,
    group: REGION_TO_CONTINENT[country.region],
    subgroup: country.region,
  };
}

const PLACES: Place[] = COUNTRIES.map(toPlace);
const PLACE_BY_ID = new Map(PLACES.map((p) => [p.id, p]));

const PLACES_BY_SUBGROUP: Record<string, Place[]> = {};
for (const [region, list] of Object.entries(COUNTRIES_BY_REGION)) {
  PLACES_BY_SUBGROUP[region] = list.map(toPlace);
}

const PLACES_BY_GROUP: Record<string, Place[]> = {};
for (const [continent, list] of Object.entries(COUNTRIES_BY_CONTINENT)) {
  PLACES_BY_GROUP[continent] = list.map(toPlace);
}

const SUBGROUPS_BY_GROUP: Record<string, string[]> = {};
for (const [continent, regions] of Object.entries(REGIONS_BY_CONTINENT)) {
  SUBGROUPS_BY_GROUP[continent] = [...regions];
}

export const WORLD_MAP: MapDef = {
  kind: 'world',
  storageKey: 'geoscore.records.v1',
  geographyUrl: '/world-110m.json',
  places: PLACES,
  placeById: PLACE_BY_ID,
  groups: [...CONTINENT_ORDER],
  subgroupsByGroup: SUBGROUPS_BY_GROUP,
  placesBySubgroup: PLACES_BY_SUBGROUP,
  placesByGroup: PLACES_BY_GROUP,
  groupKeyPrefix: 'continent',
  subgroupKeyPrefix: 'region',
  statusKeyPrefix: 'status',
  resolveId: resolveCountryId,
  projection: {
    name: 'geoEqualEarth',
    config: { scale: 175 },
    width: 980,
    height: 520,
    preserveAspectRatio: 'xMidYMid slice',
  },
  view: {
    initialZoomMobile: 2.4,
    initialZoomDesktop: 1.25,
    initialCenterMobile: [-98, 38],
    initialCenterMobileJa: [138, 36],
    initialCenterDesktop: [15, 20],
    minZoom: 0.85,
    maxZoom: 12,
    translateExtent: [
      [-300, -300],
      [1280, 820],
    ],
  },
  shareProjection: {
    name: 'geoEqualEarth',
    config: { scale: 180 },
    width: 1008,
    height: 520,
    preserveAspectRatio: 'xMidYMid meet',
  },
  hasGeometry: (id) => COUNTRY_BY_ID.has(id),
};
