'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SCORE_MAP, STATUS_ORDER } from '../lib/scoring';
import type { Status, StatusRecord } from '../lib/types';
import { useActiveMap } from './GeoScoreProvider';
import { useStatusColors } from './useStatusColors';
import { useCountryName } from './useCountryName';
import { useStatusLabel } from './useStatusLabel';

interface CountryBottomSheetProps {
  open: boolean;
  selectedId: string | null;
  records: StatusRecord;
  onChangeStatus: (placeId: string, status: Status) => void;
  onClose: () => void;
}

export function CountryBottomSheet({
  open,
  selectedId,
  records,
  onChangeStatus,
  onClose,
}: CountryBottomSheetProps) {
  const { t } = useTranslation();
  const colors = useStatusColors();
  const getName = useCountryName();
  const statusLabel = useStatusLabel();
  const map = useActiveMap();
  const place = selectedId ? map.placeById.get(selectedId) : null;

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const visible = open && place !== null;
  const status: Status = place ? (records[place.id] ?? 'never') : 'never';

  return (
    <div
      className="pointer-events-none fixed inset-0 z-40 flex items-end lg:hidden"
      aria-hidden={!visible}
    >
      <button
        type="button"
        aria-label={t('actions.close')}
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 transition-opacity ${
          visible
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0'
        }`}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={`bg-surface relative w-full rounded-t-2xl shadow-2xl transition-transform duration-200 ${
          visible
            ? 'pointer-events-auto translate-y-0'
            : 'pointer-events-none translate-y-full'
        }`}
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="border-border flex items-start justify-between gap-3 border-b px-4 pt-3 pb-2.5">
          <div className="min-w-0">
            <p className="text-foreground truncate text-base font-semibold">
              {place ? getName(place) : ''}
            </p>
            {place ? (
              <p className="text-muted truncate text-xs">
                {place.code} ・{' '}
                {t(`${map.subgroupKeyPrefix}.${place.subgroup}`)}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('actions.close')}
            className="text-muted hover:text-foreground -mt-1 -mr-1 rounded-full p-2"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <div className="px-3 py-3">
          <div className="grid grid-cols-1 gap-2">
            {STATUS_ORDER.map((s) => {
              const active = s === status;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    if (place) onChangeStatus(place.id, s);
                  }}
                  className={`flex items-center justify-between gap-3 rounded-xl border px-3 py-3 text-left transition-all duration-150 ease-out active:scale-[0.98] ${
                    active
                      ? 'border-foreground bg-background'
                      : 'border-border bg-surface hover:bg-background'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span
                      aria-hidden
                      className="inline-block h-4 w-4 rounded"
                      style={{ backgroundColor: colors[s] }}
                    />
                    <span className="font-medium">{statusLabel(s)}</span>
                  </span>
                  <span className="text-muted text-xs tabular-nums">
                    {SCORE_MAP[s]}
                    {t('labels.scoreSuffix')}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
