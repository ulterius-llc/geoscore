'use client';

import { Logo } from './Logo';
import { LanguageSwitcher } from './LanguageSwitcher';
import { MapSwitcher } from './MapSwitcher';

export function Header() {
  return (
    <header className="border-border bg-surface/85 sticky top-0 z-20 border-b backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-2.5 px-4 py-3">
        <Logo className="text-foreground h-6 w-6" />
        <h1 className="text-lg font-semibold tracking-tight">GeoScore</h1>
        <div className="ml-2 hidden sm:block">
          <MapSwitcher />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="sm:hidden">
            <MapSwitcher />
          </div>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
