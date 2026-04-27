'use client';

import { useTranslation } from 'react-i18next';

export function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-border mt-6 border-t py-4 text-xs">
      <div className="text-muted flex flex-wrap items-center justify-between gap-2">
        <p>
          {`\u00a9 ${currentYear}`} GeoScore by{' '}
          <a
            className="hover:text-foreground underline underline-offset-2"
            href="https://ulterius.dev"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ulterius LLC
          </a>
        </p>
        <div className="flex items-center gap-4">
          <a
            className="hover:text-foreground underline underline-offset-2"
            href="https://github.com/ulterius-llc/geoscore"
            target="_blank"
            rel="noopener noreferrer"
          >
            Source Code
          </a>
          <a
            className="hover:text-foreground underline underline-offset-2"
            href="https://ulterius.dev/privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('labels.privacyPolicy')}
          </a>
        </div>
      </div>
    </footer>
  );
}
