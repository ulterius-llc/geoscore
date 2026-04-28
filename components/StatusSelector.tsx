'use client';

import { useTranslation } from 'react-i18next';
import { SCORE_MAP, STATUS_ORDER } from '../lib/scoring';
import type { Status } from '../lib/types';
import { useStatusColors } from './useStatusColors';
import { useStatusLabel } from './useStatusLabel';

interface StatusSelectorProps {
  value: Status;
  onChange: (next: Status) => void;
  size?: 'sm' | 'md';
}

export function StatusSelector({
  value,
  onChange,
  size = 'md',
}: StatusSelectorProps) {
  const { t } = useTranslation();
  const colors = useStatusColors();
  const statusLabel = useStatusLabel();
  const padding = size === 'sm' ? 'px-2 py-1 text-xs' : 'px-2.5 py-1.5 text-sm';
  return (
    <div role="radiogroup" className="flex flex-wrap gap-1.5">
      {STATUS_ORDER.map((status) => {
        const active = status === value;
        return (
          <button
            key={status}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(status)}
            className={`inline-flex items-center gap-1.5 rounded-full border ${padding} transition-all duration-150 ease-out active:scale-95 ${
              active
                ? 'border-foreground bg-foreground text-background'
                : 'border-border bg-surface text-foreground hover:bg-background'
            }`}
          >
            <span
              aria-hidden
              className="inline-block h-2.5 w-2.5 rounded-sm"
              style={{ backgroundColor: colors[status] }}
            />
            <span>{statusLabel(status)}</span>
            <span className="tabular-nums opacity-70">
              {t('labels.scoreFormat', { n: SCORE_MAP[status] })}
            </span>
          </button>
        );
      })}
    </div>
  );
}
