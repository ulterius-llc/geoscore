import type { MapDef, Place } from './types';

export const US_GROUPS = ['us_east', 'us_central', 'us_west', 'us_islands'];

interface SeedState {
  fips: string;
  code: string;
  name_ja: string;
  name_en: string;
  group: (typeof US_GROUPS)[number];
}

const STATES: SeedState[] = [
  // East — east of the Mississippi River + DC
  {
    fips: '09',
    code: 'CT',
    name_ja: 'コネチカット州',
    name_en: 'Connecticut',
    group: 'us_east',
  },
  {
    fips: '10',
    code: 'DE',
    name_ja: 'デラウェア州',
    name_en: 'Delaware',
    group: 'us_east',
  },
  {
    fips: '11',
    code: 'DC',
    name_ja: 'ワシントンD.C.',
    name_en: 'District of Columbia',
    group: 'us_east',
  },
  {
    fips: '12',
    code: 'FL',
    name_ja: 'フロリダ州',
    name_en: 'Florida',
    group: 'us_east',
  },
  {
    fips: '13',
    code: 'GA',
    name_ja: 'ジョージア州',
    name_en: 'Georgia',
    group: 'us_east',
  },
  {
    fips: '18',
    code: 'IN',
    name_ja: 'インディアナ州',
    name_en: 'Indiana',
    group: 'us_east',
  },
  {
    fips: '21',
    code: 'KY',
    name_ja: 'ケンタッキー州',
    name_en: 'Kentucky',
    group: 'us_east',
  },
  {
    fips: '23',
    code: 'ME',
    name_ja: 'メイン州',
    name_en: 'Maine',
    group: 'us_east',
  },
  {
    fips: '24',
    code: 'MD',
    name_ja: 'メリーランド州',
    name_en: 'Maryland',
    group: 'us_east',
  },
  {
    fips: '25',
    code: 'MA',
    name_ja: 'マサチューセッツ州',
    name_en: 'Massachusetts',
    group: 'us_east',
  },
  {
    fips: '26',
    code: 'MI',
    name_ja: 'ミシガン州',
    name_en: 'Michigan',
    group: 'us_east',
  },
  {
    fips: '33',
    code: 'NH',
    name_ja: 'ニューハンプシャー州',
    name_en: 'New Hampshire',
    group: 'us_east',
  },
  {
    fips: '34',
    code: 'NJ',
    name_ja: 'ニュージャージー州',
    name_en: 'New Jersey',
    group: 'us_east',
  },
  {
    fips: '36',
    code: 'NY',
    name_ja: 'ニューヨーク州',
    name_en: 'New York',
    group: 'us_east',
  },
  {
    fips: '37',
    code: 'NC',
    name_ja: 'ノースカロライナ州',
    name_en: 'North Carolina',
    group: 'us_east',
  },
  {
    fips: '39',
    code: 'OH',
    name_ja: 'オハイオ州',
    name_en: 'Ohio',
    group: 'us_east',
  },
  {
    fips: '42',
    code: 'PA',
    name_ja: 'ペンシルベニア州',
    name_en: 'Pennsylvania',
    group: 'us_east',
  },
  {
    fips: '44',
    code: 'RI',
    name_ja: 'ロードアイランド州',
    name_en: 'Rhode Island',
    group: 'us_east',
  },
  {
    fips: '45',
    code: 'SC',
    name_ja: 'サウスカロライナ州',
    name_en: 'South Carolina',
    group: 'us_east',
  },
  {
    fips: '47',
    code: 'TN',
    name_ja: 'テネシー州',
    name_en: 'Tennessee',
    group: 'us_east',
  },
  {
    fips: '50',
    code: 'VT',
    name_ja: 'バーモント州',
    name_en: 'Vermont',
    group: 'us_east',
  },
  {
    fips: '51',
    code: 'VA',
    name_ja: 'バージニア州',
    name_en: 'Virginia',
    group: 'us_east',
  },
  {
    fips: '54',
    code: 'WV',
    name_ja: 'ウェストバージニア州',
    name_en: 'West Virginia',
    group: 'us_east',
  },

  // Central — Mississippi corridor + Great Plains
  {
    fips: '01',
    code: 'AL',
    name_ja: 'アラバマ州',
    name_en: 'Alabama',
    group: 'us_central',
  },
  {
    fips: '05',
    code: 'AR',
    name_ja: 'アーカンソー州',
    name_en: 'Arkansas',
    group: 'us_central',
  },
  {
    fips: '17',
    code: 'IL',
    name_ja: 'イリノイ州',
    name_en: 'Illinois',
    group: 'us_central',
  },
  {
    fips: '19',
    code: 'IA',
    name_ja: 'アイオワ州',
    name_en: 'Iowa',
    group: 'us_central',
  },
  {
    fips: '20',
    code: 'KS',
    name_ja: 'カンザス州',
    name_en: 'Kansas',
    group: 'us_central',
  },
  {
    fips: '22',
    code: 'LA',
    name_ja: 'ルイジアナ州',
    name_en: 'Louisiana',
    group: 'us_central',
  },
  {
    fips: '27',
    code: 'MN',
    name_ja: 'ミネソタ州',
    name_en: 'Minnesota',
    group: 'us_central',
  },
  {
    fips: '28',
    code: 'MS',
    name_ja: 'ミシシッピ州',
    name_en: 'Mississippi',
    group: 'us_central',
  },
  {
    fips: '29',
    code: 'MO',
    name_ja: 'ミズーリ州',
    name_en: 'Missouri',
    group: 'us_central',
  },
  {
    fips: '31',
    code: 'NE',
    name_ja: 'ネブラスカ州',
    name_en: 'Nebraska',
    group: 'us_central',
  },
  {
    fips: '38',
    code: 'ND',
    name_ja: 'ノースダコタ州',
    name_en: 'North Dakota',
    group: 'us_central',
  },
  {
    fips: '40',
    code: 'OK',
    name_ja: 'オクラホマ州',
    name_en: 'Oklahoma',
    group: 'us_central',
  },
  {
    fips: '46',
    code: 'SD',
    name_ja: 'サウスダコタ州',
    name_en: 'South Dakota',
    group: 'us_central',
  },
  {
    fips: '48',
    code: 'TX',
    name_ja: 'テキサス州',
    name_en: 'Texas',
    group: 'us_central',
  },
  {
    fips: '55',
    code: 'WI',
    name_ja: 'ウィスコンシン州',
    name_en: 'Wisconsin',
    group: 'us_central',
  },

  // West — Mountain + Pacific (contiguous)
  {
    fips: '04',
    code: 'AZ',
    name_ja: 'アリゾナ州',
    name_en: 'Arizona',
    group: 'us_west',
  },
  {
    fips: '06',
    code: 'CA',
    name_ja: 'カリフォルニア州',
    name_en: 'California',
    group: 'us_west',
  },
  {
    fips: '08',
    code: 'CO',
    name_ja: 'コロラド州',
    name_en: 'Colorado',
    group: 'us_west',
  },
  {
    fips: '16',
    code: 'ID',
    name_ja: 'アイダホ州',
    name_en: 'Idaho',
    group: 'us_west',
  },
  {
    fips: '30',
    code: 'MT',
    name_ja: 'モンタナ州',
    name_en: 'Montana',
    group: 'us_west',
  },
  {
    fips: '32',
    code: 'NV',
    name_ja: 'ネバダ州',
    name_en: 'Nevada',
    group: 'us_west',
  },
  {
    fips: '35',
    code: 'NM',
    name_ja: 'ニューメキシコ州',
    name_en: 'New Mexico',
    group: 'us_west',
  },
  {
    fips: '41',
    code: 'OR',
    name_ja: 'オレゴン州',
    name_en: 'Oregon',
    group: 'us_west',
  },
  {
    fips: '49',
    code: 'UT',
    name_ja: 'ユタ州',
    name_en: 'Utah',
    group: 'us_west',
  },
  {
    fips: '53',
    code: 'WA',
    name_ja: 'ワシントン州',
    name_en: 'Washington',
    group: 'us_west',
  },
  {
    fips: '56',
    code: 'WY',
    name_ja: 'ワイオミング州',
    name_en: 'Wyoming',
    group: 'us_west',
  },

  // Islands — non-contiguous states + territories
  {
    fips: '02',
    code: 'AK',
    name_ja: 'アラスカ州',
    name_en: 'Alaska',
    group: 'us_islands',
  },
  {
    fips: '15',
    code: 'HI',
    name_ja: 'ハワイ州',
    name_en: 'Hawaii',
    group: 'us_islands',
  },
  {
    fips: '60',
    code: 'AS',
    name_ja: 'アメリカ領サモア',
    name_en: 'American Samoa',
    group: 'us_islands',
  },
  {
    fips: '66',
    code: 'GU',
    name_ja: 'グアム',
    name_en: 'Guam',
    group: 'us_islands',
  },
  {
    fips: '69',
    code: 'MP',
    name_ja: '北マリアナ諸島',
    name_en: 'Northern Mariana Islands',
    group: 'us_islands',
  },
  {
    fips: '72',
    code: 'PR',
    name_ja: 'プエルトリコ',
    name_en: 'Puerto Rico',
    group: 'us_islands',
  },
  {
    fips: '78',
    code: 'VI',
    name_ja: 'アメリカ領ヴァージン諸島',
    name_en: 'U.S. Virgin Islands',
    group: 'us_islands',
  },
];

const PLACES: Place[] = STATES.map((s) => ({
  id: s.fips,
  code: s.code,
  name_ja: s.name_ja,
  name_en: s.name_en,
  group: s.group,
  subgroup: s.group,
}));

const PLACE_BY_ID = new Map(PLACES.map((p) => [p.id, p]));
const PLACE_BY_NAME = new Map(STATES.map((s) => [s.name_en, s.fips]));

function buildPlacesByGroup(): Record<string, Place[]> {
  const result: Record<string, Place[]> = {};
  for (const group of US_GROUPS) {
    result[group] = PLACES.filter((p) => p.group === group).sort((a, b) =>
      a.name_ja.localeCompare(b.name_ja, 'ja')
    );
  }
  return result;
}

const PLACES_BY_GROUP = buildPlacesByGroup();

const SUBGROUPS_BY_GROUP: Record<string, string[]> = {};
for (const group of US_GROUPS) {
  SUBGROUPS_BY_GROUP[group] = [group];
}

export const US_MAP: MapDef = {
  kind: 'us',
  storageKey: 'geoscore.records.us.v1',
  geographyUrl: '/us-states-10m.json',
  places: PLACES,
  placeById: PLACE_BY_ID,
  groups: US_GROUPS,
  subgroupsByGroup: SUBGROUPS_BY_GROUP,
  placesBySubgroup: PLACES_BY_GROUP,
  placesByGroup: PLACES_BY_GROUP,
  groupKeyPrefix: 'usGroup',
  subgroupKeyPrefix: 'usGroup',
  statusKeyPrefix: 'usStatus',
  resolveId: (geoId, geoName) => {
    if (geoId && PLACE_BY_ID.has(geoId)) return geoId;
    if (geoName && PLACE_BY_NAME.has(geoName))
      return PLACE_BY_NAME.get(geoName) ?? null;
    return null;
  },
  projection: {
    name: 'geoAlbersUsa',
    config: { scale: 1100 },
    width: 980,
    height: 580,
    preserveAspectRatio: 'xMidYMid meet',
  },
  view: {
    initialZoomMobile: 1,
    initialZoomDesktop: 1,
    initialCenterMobile: [0, 0],
    initialCenterDesktop: [0, 0],
    minZoom: 1,
    maxZoom: 8,
    translateExtent: [
      [-200, -200],
      [1180, 780],
    ],
  },
  shareProjection: {
    name: 'geoAlbersUsa',
    config: { scale: 1200 },
    width: 1008,
    height: 600,
    preserveAspectRatio: 'xMidYMid meet',
  },
  hasGeometry: (id) => PLACE_BY_ID.has(id),
};
