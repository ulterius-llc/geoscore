'use client';

import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SCORE_MAP } from '../lib/scoring';
import type { Status, StatusRecord } from '../lib/types';
import { useActiveMap } from './GeoScoreProvider';
import { StatusSelector } from './StatusSelector';
import { useCountryName } from './useCountryName';
import { useStatusLabel } from './useStatusLabel';

interface SelectedCountryCardProps {
  selectedId: string | null;
  records: StatusRecord;
  onChangeStatus: (placeId: string, status: Status) => void;
  onClear: () => void;
}

export function SelectedCountryCard({
  selectedId,
  records,
  onChangeStatus,
  onClear,
}: SelectedCountryCardProps) {
  const { t } = useTranslation();
  const map = useActiveMap();
  const getName = useCountryName();
  const statusLabel = useStatusLabel();
  const place = selectedId ? map.placeById.get(selectedId) : null;

  if (!place) {
    return (
      <section className="border-border bg-surface rounded-2xl border p-4">
        <p className="text-muted text-sm">{t('labels.selectCountry')}</p>
      </section>
    );
  }

  const status: Status = records[place.id] ?? 'never';

  return (
    <section className="border-border bg-surface rounded-2xl border p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">{getName(place)}</h2>
          <p className="text-muted text-xs">
            {place.code} ・ {t(`${map.subgroupKeyPrefix}.${place.subgroup}`)}
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
        onChange={(s) => onChangeStatus(place.id, s)}
      />
      <p className="text-muted mt-2 text-xs">
        {statusLabel(status)} ({SCORE_MAP[status]}
        {t('labels.scoreSuffix')})
      </p>
    </section>
  );
}
