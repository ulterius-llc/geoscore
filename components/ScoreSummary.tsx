'use client';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { COUNTRIES } from '../lib/countries';
import { SCORE_MAP, STATUS_ORDER } from '../lib/scoring';
import type { Status, StatusRecord } from '../lib/types';
import { useStatusColors } from './useStatusColors';

interface ScoreSummaryProps {
  records: StatusRecord;
}

interface SummaryStats {
  total: number;
  max: number;
  visited: number;
  countries: number;
  byStatus: Record<Status, number>;
}

function computeStats(records: StatusRecord): SummaryStats {
  const byStatus: Record<Status, number> = {
    live: 0,
    stay: 0,
    visit: 0,
    transit: 0,
    never: 0,
  };
  let total = 0;
  let visited = 0;
  for (const country of COUNTRIES) {
    const status = records[country.id] ?? 'never';
    byStatus[status] += 1;
    total += SCORE_MAP[status];
    if (status !== 'never') visited += 1;
  }
  return {
    total,
    max: COUNTRIES.length * SCORE_MAP.live,
    visited,
    countries: COUNTRIES.length,
    byStatus,
  };
}

export function ScoreSummary({ records }: ScoreSummaryProps) {
  const { t } = useTranslation();
  const colors = useStatusColors();
  const stats = useMemo(() => computeStats(records), [records]);
  const ratePct =
    stats.max > 0 ? Math.round((stats.total / stats.max) * 1000) / 10 : 0;

  return (
    <section className="border-border bg-surface rounded-2xl border p-4 sm:p-5">
      <div className="grid grid-cols-3 gap-3 text-center">
        <Stat
          label={t('summary.total')}
          value={stats.total.toString()}
          suffix={t('labels.scoreSuffix')}
        />
        <Stat
          label={t('summary.visited')}
          value={stats.visited.toString()}
          suffix={`/ ${stats.countries}`}
        />
        <Stat label={t('summary.rate')} value={ratePct.toString()} suffix="%" />
      </div>

      <div className="mt-4">
        <div
          className="flex h-2 w-full overflow-hidden rounded-full"
          style={{ backgroundColor: colors.never }}
        >
          {STATUS_ORDER.filter((s) => s !== 'never').map((status) => {
            const pct = (stats.byStatus[status] / stats.countries) * 100;
            if (pct <= 0) return null;
            return (
              <span
                key={status}
                style={{ width: `${pct}%`, backgroundColor: colors[status] }}
                aria-hidden
              />
            );
          })}
        </div>
      </div>

      <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
        {STATUS_ORDER.map((status) => (
          <li
            key={status}
            className="border-border flex items-center gap-2 rounded-lg border px-3 py-2"
          >
            <span
              aria-hidden
              className="inline-block h-3 w-3 rounded-sm"
              style={{ backgroundColor: colors[status] }}
            />
            <div className="flex min-w-0 flex-1 items-baseline justify-between gap-1">
              <span className="text-muted text-xs">
                {t(`status.${status}`)}
              </span>
              <span className="text-sm font-medium tabular-nums">
                {stats.byStatus[status]}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

interface StatProps {
  label: string;
  value: string;
  suffix?: string;
}

function Stat({ label, value, suffix }: StatProps) {
  return (
    <div className="bg-background rounded-xl px-3 py-3">
      <div className="text-muted text-xs">{label}</div>
      <div className="mt-1 flex items-baseline justify-center gap-1">
        <span className="text-2xl font-semibold tabular-nums">{value}</span>
        {suffix ? <span className="text-muted text-xs">{suffix}</span> : null}
      </div>
    </div>
  );
}
