'use client';

import { useTranslation } from 'react-i18next';
import type { Country } from '../lib/types';

export function useCountryName(): (country: Country) => string {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  return (country: Country) =>
    lang.startsWith('en') ? country.name_en : country.name_ja;
}
