'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES, type LangCode } from '../lib/i18n';

const LABELS: Record<LangCode, string> = {
  ja: '日本語',
  en: 'English',
};

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = (i18n.language?.startsWith('en') ? 'en' : 'ja') as LangCode;

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  function pick(code: LangCode) {
    void i18n.changeLanguage(code);
    setOpen(false);
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t('actions.language')}
        className="border-border bg-surface hover:bg-background text-foreground inline-flex items-center gap-1 rounded-full border px-2.5 py-1.5 text-xs transition-colors"
      >
        <Languages className="h-3.5 w-3.5" aria-hidden />
        <span>{LABELS[current]}</span>
        <ChevronDown
          className={`h-3 w-3 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </button>
      <ul
        role="listbox"
        aria-hidden={!open}
        className={`border-border bg-surface absolute top-full right-0 z-30 mt-1 min-w-32 origin-top-right overflow-hidden rounded-lg border text-sm shadow-lg transition-all duration-150 ease-out ${
          open
            ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
            : 'pointer-events-none -translate-y-1 scale-95 opacity-0'
        }`}
      >
        {SUPPORTED_LANGUAGES.map((code) => {
          const active = code === current;
          return (
            <li key={code}>
              <button
                type="button"
                role="option"
                aria-selected={active}
                tabIndex={open ? 0 : -1}
                onClick={() => pick(code)}
                className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-left transition-colors ${
                  active ? 'bg-background' : 'hover:bg-background'
                }`}
              >
                <span>{LABELS[code]}</span>
                {active ? (
                  <Check className="text-accent h-4 w-4" aria-hidden />
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
