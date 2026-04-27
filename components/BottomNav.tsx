'use client';

import { Globe2, List, Share2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export type MobileView = 'home' | 'list' | 'share';

interface BottomNavProps {
  value: MobileView;
  onChange: (next: MobileView) => void;
}

const ITEMS: ReadonlyArray<{
  id: MobileView;
  icon: typeof Globe2;
  labelKey: string;
}> = [
  { id: 'home', icon: Globe2, labelKey: 'nav.home' },
  { id: 'list', icon: List, labelKey: 'nav.list' },
  { id: 'share', icon: Share2, labelKey: 'nav.share' },
];

export function BottomNav({ value, onChange }: BottomNavProps) {
  const { t } = useTranslation();
  return (
    <nav
      aria-label={t('nav.ariaLabel')}
      className="border-border bg-surface/95 fixed inset-x-0 bottom-0 z-30 border-t pt-2 backdrop-blur lg:hidden"
      style={{
        paddingBottom: 'calc(env(safe-area-inset-bottom) + 0.5rem)',
      }}
    >
      <ul className="mx-auto grid max-w-md grid-cols-3">
        {ITEMS.map((item) => {
          const active = value === item.id;
          const Icon = item.icon;
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onChange(item.id)}
                aria-current={active ? 'page' : undefined}
                className={`flex w-full flex-col items-center gap-0.5 py-2 text-[11px] transition-colors duration-150 active:scale-95 ${
                  active ? 'text-foreground' : 'text-muted'
                }`}
              >
                <Icon
                  className={`h-5 w-5 transition-all duration-200 ${active ? 'opacity-100' : 'opacity-80'}`}
                  strokeWidth={active ? 2.2 : 1.8}
                  aria-hidden
                />
                <span className={active ? 'font-medium' : ''}>
                  {t(item.labelKey)}
                </span>
                <span
                  aria-hidden
                  className={`mt-1 h-0.5 w-5 rounded-full transition-opacity duration-200 ${
                    active ? 'bg-foreground opacity-100' : 'opacity-0'
                  }`}
                />
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
