'use client';

import { useTranslation } from 'react-i18next';
import { SCORE_MAP, STATUS_ORDER } from '../lib/scoring';
import { useStatusColors } from './useStatusColors';
import { useStatusLabel } from './useStatusLabel';

export function Legend() {
  const { t } = useTranslation();
  const colors = useStatusColors();
  const statusLabel = useStatusLabel();
  return (
    <ul className="text-muted flex flex-wrap gap-x-3 gap-y-2 text-xs">
      {STATUS_ORDER.map((status) => (
        <li key={status} className="inline-flex items-center gap-1.5">
          <span
            aria-hidden
            className="border-border inline-block h-3 w-3 rounded-sm border"
            style={{ backgroundColor: colors[status] }}
          />
          <span className="text-foreground">{statusLabel(status)}</span>
          <span className="tabular-nums">
            {t('labels.scoreFormat', { n: SCORE_MAP[status] })}
          </span>
        </li>
      ))}
    </ul>
  );
}
