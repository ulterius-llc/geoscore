'use client';

import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import ja from './locales/ja.json';
import en from './locales/en.json';

const STORAGE_KEY = 'geoscore.lang.v1';
export const SUPPORTED_LANGUAGES = ['en', 'ja'] as const;
export type LangCode = (typeof SUPPORTED_LANGUAGES)[number];

if (!i18next.isInitialized) {
  void i18next.use(initReactI18next).init({
    resources: {
      ja: { translation: ja },
      en: { translation: en },
    },
    // Always init with English so SSR HTML and the initial client render match.
    // The provider re-applies the user's saved language after hydration.
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    returnNull: false,
  });

  if (typeof window !== 'undefined') {
    i18next.on('languageChanged', (lng) => {
      try {
        window.localStorage.setItem(STORAGE_KEY, lng);
      } catch {
        // ignore storage failures
      }
    });
  }
}

export function loadStoredLanguage(): LangCode | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'ja' || stored === 'en') return stored;
  } catch {
    // ignore
  }
  return null;
}

export default i18next;
