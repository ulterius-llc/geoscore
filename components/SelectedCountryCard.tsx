'use client';

import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { COUNTRY_BY_ID } from '../lib/countries';
import { SCORE_MAP } from '../lib/scoring';
import type { Status, StatusRecord } from '../lib/types';
import { StatusSelector } from './StatusSelector';
import { useCountryName } from './useCountryName';

interface SelectedCountryCardProps {
  selectedId: string | null;
  records: StatusRecord;
  onChangeStatus: (countryId: string, status: Status) => void;
  onClear: () => void;
}

export function SelectedCountryCard({
  selectedId,
  records,
  onChangeStatus,
  onClear,
}: SelectedCountryCardProps) {
  const { t } = useTranslation();
  const getName = useCountryName();
  const country = selectedId ? COUNTRY_BY_ID.get(selectedId) : null;

  if (!country) {
    return (
      <section className="border-border bg-surface rounded-2xl border p-4">
        <p className="text-muted text-sm">{t('labels.selectCountry')}</p>
      </section>
    );
  }

  const status: Status = records[country.id] ?? 'never';

  return (
    <section className="border-border bg-surface rounded-2xl border p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">{getName(country)}</h2>
          <p className="text-muted text-xs">
            {country.iso_a3} ・ {t(`region.${country.region}`)}
          </p>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="text-muted hover:text-foreground rounded-full p-1"
          aria-label={t('actions.close')}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <StatusSelector
        value={status}
        onChange={(s) => onChangeStatus(country.id, s)}
      />
      <p className="text-muted mt-2 text-xs">
        {t(`status.${status}`)} ({SCORE_MAP[status]}
        {t('labels.scoreSuffix')})
      </p>
    </section>
  );
}
