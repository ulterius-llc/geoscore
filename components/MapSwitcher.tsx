'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';

interface MapTab {
  href: string;
  labelKey: string;
  match: (path: string | null) => boolean;
}

const TABS: MapTab[] = [
  {
    href: '/',
    labelKey: 'map.world',
    match: (p) => !p || (p !== '/us' && !p.startsWith('/us/')),
  },
  {
    href: '/us',
    labelKey: 'map.us',
    match: (p) => p === '/us' || (p?.startsWith('/us/') ?? false),
  },
];

export function MapSwitcher() {
  const { t } = useTranslation();
  const pathname = usePathname();

  return (
    <div
      role="tablist"
      aria-label={t('map.switchTo')}
      className="border-border bg-background inline-flex items-center gap-0.5 rounded-full border p-0.5"
    >
      {TABS.map((tab) => {
        const active = tab.match(pathname);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            role="tab"
            aria-selected={active}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              active
                ? 'bg-surface text-foreground shadow-sm'
                : 'text-muted hover:text-foreground'
            }`}
          >
            {t(tab.labelKey)}
          </Link>
        );
      })}
    </div>
  );
}
