'use client';

import { useTranslation } from 'react-i18next';
import type { Place } from '../lib/maps/types';
import type { Country } from '../lib/types';

interface NameLike {
  name_ja: string;
  name_en: string;
}

export function useCountryName(): (item: NameLike) => string {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  return (item: NameLike) =>
    lang.startsWith('en') ? item.name_en : item.name_ja;
}

export type { Country, Place };
