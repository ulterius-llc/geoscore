'use client';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CONTINENT_ORDER, COUNTRIES_BY_CONTINENT } from '../lib/countries';
import { SCORE_MAP } from '../lib/scoring';
import type { Continent, StatusRecord } from '../lib/types';
import { useStatusColors } from './useStatusColors';

interface ContinentBadgesProps {
  records: StatusRecord;
}

interface ContinentStat {
  continent: Continent;
  visited: number;
  total: number;
  score: number;
  max: number;
}

function compute(records: StatusRecord): ContinentStat[] {
  return CONTINENT_ORDER.map((continent) => {
    const countries = COUNTRIES_BY_CONTINENT[continent];
    let visited = 0;
    let score = 0;
    for (const c of countries) {
      const status = records[c.id] ?? 'never';
      if (status !== 'never') visited += 1;
      score += SCORE_MAP[status];
    }
    return {
      continent,
      visited,
      total: countries.length,
      score,
      max: countries.length * SCORE_MAP.live,
    };
  });
}

export function ContinentBadges({ records }: ContinentBadgesProps) {
  const { t } = useTranslation();
  const colors = useStatusColors();
  const stats = useMemo(() => compute(records), [records]);

  return (
    <section className="border-border bg-surface rounded-2xl border p-3 sm:p-4">
      <h2 className="text-foreground mb-2 text-sm font-semibold">
        {t('summary.rate')}
      </h2>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {stats.map((s) => {
          const visitRatio = s.total > 0 ? s.visited / s.total : 0;
          const scoreRatio = s.max > 0 ? s.score / s.max : 0;
          const pct = Math.round(scoreRatio * 100);
          return (
            <li
              key={s.continent}
              className="border-border bg-background flex flex-col gap-1.5 rounded-xl border p-2.5"
            >
              <div className="flex items-baseline justify-between gap-1">
                <span className="text-xs font-medium">
                  {t(`continent.${s.continent}`)}
                </span>
                <span className="text-muted text-xs tabular-nums">{pct}%</span>
              </div>
              <div className="text-muted flex items-baseline justify-between text-[11px] tabular-nums">
                <span>
                  {s.visited} / {s.total}
                </span>
                <span>
                  {s.score} / {s.max}
                </span>
              </div>
              <div
                className="relative h-1.5 w-full overflow-hidden rounded-full"
                style={{ backgroundColor: colors.never }}
                aria-hidden
              >
                <span
                  className="absolute inset-y-0 left-0 transition-[width,background-color] duration-300 ease-out"
                  style={{
                    width: `${Math.round(visitRatio * 100)}%`,
                    backgroundColor: colors.visit,
                    opacity: 0.55,
                  }}
                />
                <span
                  className="absolute inset-y-0 left-0 transition-[width,background-color] duration-300 ease-out"
                  style={{
                    width: `${Math.round(scoreRatio * 100)}%`,
                    backgroundColor: colors.live,
                  }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
