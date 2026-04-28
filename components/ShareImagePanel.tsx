'use client';

import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import {
  ComposableMap,
  Geographies,
  Geography,
  Sphere,
} from 'react-simple-maps';
import { ImageDown, Loader2, Smartphone, Tv2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  CONTINENT_ORDER,
  COUNTRIES,
  COUNTRIES_BY_CONTINENT,
  COUNTRY_BY_ID,
  resolveCountryId,
} from '../lib/countries';
import { SCORE_MAP, STATUS_COLORS, STATUS_ORDER } from '../lib/scoring';
import type { Continent, Status, StatusRecord } from '../lib/types';

const PRIMARY = '#0f766e';
const TEXT_PRIMARY = '#111418';
const TEXT_MUTED = '#6b7280';
const SURFACE = '#f7f7f8';
const TRACK = '#e2e8f0';
const PORTRAIT_TOTAL_Y_OFFSET = -36;
const SHARE_NAME_KEY = 'geoscore.shareName.v1';
const SHARE_NAME_MAX_LENGTH = 30;

type ShareFormat = 'landscape' | 'portrait';

interface ShareImagePanelProps {
  records: StatusRecord;
}

interface ShareCardProps {
  records: StatusRecord;
  format: ShareFormat;
  generatedAt: string;
  name: string;
}

function computeBreakdown(records: StatusRecord) {
  const byStatus: Record<Status, number> = {
    live: 0,
    stay: 0,
    visit: 0,
    transit: 0,
    never: 0,
  };
  let total = 0;
  for (const country of COUNTRIES) {
    const status = records[country.id] ?? 'never';
    byStatus[status] += 1;
    total += SCORE_MAP[status];
  }
  return { byStatus, total };
}

interface ContinentStat {
  continent: Continent;
  visited: number;
  total: number;
  pct: number;
}

function computeContinentStats(records: StatusRecord): ContinentStat[] {
  return CONTINENT_ORDER.map((continent) => {
    const list = COUNTRIES_BY_CONTINENT[continent];
    let visited = 0;
    let score = 0;
    for (const c of list) {
      const status = records[c.id] ?? 'never';
      if (status !== 'never') visited += 1;
      score += SCORE_MAP[status];
    }
    const maxScore = list.length * SCORE_MAP.live;
    return {
      continent,
      visited,
      total: list.length,
      pct: maxScore > 0 ? Math.round((score / maxScore) * 100) : 0,
    };
  });
}

const FONT_FAMILY =
  '-apple-system, "Segoe UI", "Hiragino Kaku Gothic ProN", "Yu Gothic", Meiryo, sans-serif';

function formatGeneratedAt(date: Date, lang: string): string {
  const isJa = lang.startsWith('ja');
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  if (isJa) {
    const hours = String(date.getHours()).padStart(2, '0');
    return `${y}/${m}/${d} ${hours}:${minutes}`;
  }
  const h24 = date.getHours();
  const period = h24 >= 12 ? 'PM' : 'AM';
  const h12 = h24 % 12 || 12;
  return `${m}/${d}/${y} ${h12}:${minutes} ${period}`;
}

const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(function ShareCard(
  { records, format, generatedAt, name },
  ref
) {
  const { t } = useTranslation();
  const { byStatus, total } = useMemo(
    () => computeBreakdown(records),
    [records]
  );
  const continents = useMemo(() => computeContinentStats(records), [records]);
  const visited = COUNTRIES.length - byStatus.never;
  const maxScore = COUNTRIES.length * SCORE_MAP.live;
  const overallPct = maxScore > 0 ? Math.round((total / maxScore) * 100) : 0;
  const formatScore = (n: number) => t('labels.scoreFormat', { n });

  if (format === 'portrait') {
    return (
      <div
        ref={ref}
        style={{
          width: 1080,
          height: 1920,
          background: '#ffffff',
          color: TEXT_PRIMARY,
          padding: 64,
          fontFamily: FONT_FAMILY,
          display: 'flex',
          flexDirection: 'column',
          gap: 36,
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ fontSize: 44, fontWeight: 800, letterSpacing: -1 }}>
              GeoScore
            </div>
            {name ? (
              <div style={{ fontSize: 24, color: TEXT_MUTED, fontWeight: 600 }}>
                {t('labels.namedGeoScore', { name })}
              </div>
            ) : null}
          </div>
          <div style={{ fontSize: 22, color: TEXT_MUTED }}>{generatedAt}</div>
        </div>

        <div
          style={{
            background: SURFACE,
            borderRadius: 32,
            padding: '56px 48px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 18,
          }}
        >
          <div style={{ fontSize: 26, color: TEXT_MUTED, letterSpacing: 0.5 }}>
            {t('summary.total')}
          </div>

          <div
            style={{
              height: 240,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-end',
            }}
          >
            <span
              style={{
                fontSize: 220,
                lineHeight: 1,
                fontWeight: 800,
                color: PRIMARY,
                fontVariantNumeric: 'tabular-nums',
                display: 'block',
                marginBottom: 0,
                transform: `translateY(${PORTRAIT_TOTAL_Y_OFFSET}px)`,
              }}
            >
              {total}
            </span>

            <span
              style={{
                fontSize: 32,
                lineHeight: 1,
                fontWeight: 400,
                color: TEXT_MUTED,
                fontVariantNumeric: 'tabular-nums',
                display: 'block',
                marginLeft: 16,
                marginBottom: 0,
              }}
            >
              {`/ ${maxScore} ${t('labels.scoreSuffix')}`}
            </span>
          </div>

          <div
            style={{
              marginTop: 48,
              width: '100%',
              height: 18,
              background: TRACK,
              borderRadius: 999,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${overallPct}%`,
                height: '100%',
                background: PRIMARY,
                borderRadius: 999,
              }}
            />
          </div>
          <div
            style={{
              fontSize: 24,
              color: TEXT_MUTED,
              marginTop: 4,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {`${t('summary.rate')} ${overallPct}% ・ ${t('summary.visited')} ${visited} / ${COUNTRIES.length}`}
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: 16,
          }}
        >
          {STATUS_ORDER.map((status) => (
            <div
              key={status}
              style={{
                background: SURFACE,
                borderRadius: 20,
                padding: '12px 18px 36px',
                borderTop: `6px solid ${STATUS_COLORS[status]}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 16,
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: 18,
                  color: TEXT_MUTED,
                  whiteSpace: 'nowrap',
                  fontWeight: 600,
                }}
              >
                {`${t(`status.${status}`)}・${formatScore(SCORE_MAP[status])}`}
              </div>
              <div
                style={{
                  fontSize: 56,
                  fontWeight: 800,
                  fontVariantNumeric: 'tabular-nums',
                  lineHeight: 1,
                  color: TEXT_PRIMARY,
                }}
              >
                {byStatus[status]}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            background: SURFACE,
            borderRadius: 28,
            padding: '36px 40px',
            display: 'flex',
            flexDirection: 'column',
            gap: 22,
            flex: '1 1 auto',
          }}
        >
          <div style={{ fontSize: 28, fontWeight: 700 }}>
            {t('summary.rate')}
          </div>
          {continents.map((c) => (
            <div
              key={c.continent}
              style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  fontSize: 22,
                  color: TEXT_PRIMARY,
                }}
              >
                <span style={{ fontWeight: 600 }}>
                  {t(`continent.${c.continent}`)}
                </span>
                <span
                  style={{
                    color: TEXT_MUTED,
                    fontVariantNumeric: 'tabular-nums',
                    fontSize: 20,
                  }}
                >
                  {`${c.visited} / ${c.total} ・ ${c.pct}%`}
                </span>
              </div>
              <div
                style={{
                  height: 14,
                  background: TRACK,
                  borderRadius: 999,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${c.pct}%`,
                    height: '100%',
                    background: PRIMARY,
                    borderRadius: 999,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      style={{
        width: 1080,
        background: '#ffffff',
        color: '#111418',
        padding: 36,
        fontFamily: FONT_FAMILY,
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
        }}
      >
        <div>
          <div style={{ fontSize: 14, color: '#6b7280' }}>
            {name
              ? t('labels.namedGeoScore', { name })
              : t('labels.yourGeoScore')}
          </div>
          <div style={{ fontSize: 36, fontWeight: 700, marginTop: 4 }}>
            GeoScore
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 14, color: '#6b7280' }}>
            {t('summary.total')}
          </div>
          <div style={{ fontSize: 44, fontWeight: 700, color: '#0f766e' }}>
            {total}
            <span
              style={{
                fontSize: 18,
                color: '#6b7280',
                marginLeft: 6,
              }}
            >
              {t('labels.scoreSuffix')}
            </span>
          </div>
        </div>
      </div>

      <div
        style={{
          background: '#e5edf5',
          borderRadius: 16,
          overflow: 'hidden',
        }}
      >
        <ComposableMap
          projection="geoEqualEarth"
          width={1008}
          height={520}
          projectionConfig={{ scale: 180 }}
          style={{ width: '100%', height: 'auto', display: 'block' }}
        >
          <Sphere
            id="share-sphere-landscape"
            stroke="transparent"
            strokeWidth={0}
            fill="#e5edf5"
          />
          <Geographies geography="/world-110m.json">
            {({ geographies }) =>
              geographies.map((geo) => {
                const cid = resolveCountryId(
                  typeof geo.id === 'string' ? geo.id : undefined,
                  geo.properties?.name
                );
                const country = cid ? COUNTRY_BY_ID.get(cid) : null;
                const status: Status = country
                  ? (records[country.id] ?? 'never')
                  : 'never';
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    style={{
                      default: {
                        fill: STATUS_COLORS[status],
                        stroke: '#ffffff',
                        strokeWidth: 0.5,
                        outline: 'none',
                      },
                      hover: { outline: 'none' },
                      pressed: { outline: 'none' },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 10,
        }}
      >
        {STATUS_ORDER.map((status) => (
          <div
            key={status}
            style={{
              background: SURFACE,
              borderRadius: 14,
              borderTop: `4px solid ${STATUS_COLORS[status]}`,
              padding: '12px 20px',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              minHeight: '88px',
              minWidth: 0,
            }}
          >
            <div
              style={{
                color: TEXT_MUTED,
                fontSize: 13,
                whiteSpace: 'nowrap',
                lineHeight: 1.2,
                alignSelf: 'flex-start',
              }}
            >
              {`${t(`status.${status}`)}・${formatScore(SCORE_MAP[status])}`}
            </div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 700,
                color: TEXT_PRIMARY,
                fontVariantNumeric: 'tabular-nums',
                lineHeight: 1,
                alignSelf: 'center',
              }}
            >
              {byStatus[status]}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 12,
          color: TEXT_MUTED,
        }}
      >
        <span>
          {`${t('summary.visited')}: ${visited} / ${COUNTRIES.length} ${t('summary.countries')}`}
        </span>
        <span>{`${t('labels.generatedAt')}: ${generatedAt}`}</span>
      </div>
    </div>
  );
});

export function ShareImagePanel({ records }: ShareImagePanelProps) {
  const { t, i18n } = useTranslation();
  const cardRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [format, setFormat] = useState<ShareFormat>('landscape');
  const [generatedAt, setGeneratedAt] = useState<string>(() =>
    formatGeneratedAt(new Date(), i18n.language ?? 'en')
  );
  const [name, setName] = useState<string>(() => {
    if (typeof window === 'undefined') return '';
    try {
      return window.localStorage.getItem(SHARE_NAME_KEY) ?? '';
    } catch {
      return '';
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(SHARE_NAME_KEY, name);
    } catch {
      // Ignore storage errors.
    }
  }, [name]);

  async function handleDownload(target: ShareFormat) {
    if (busy) return;

    flushSync(() => {
      setFormat(target);
      setBusy(true);
      setMessage(t('messages.shareGenerating'));
      setGeneratedAt(formatGeneratedAt(new Date(), i18n.language ?? 'en'));
    });

    await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
    await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));

    if ('fonts' in document) {
      await (document as Document & { fonts: FontFaceSet }).fonts.ready;
    }

    if (!cardRef.current) {
      setBusy(false);
      return;
    }

    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      const stamp = new Date().toISOString().slice(0, 10);
      link.download = `geoscore-${target}-${stamp}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setMessage(t('messages.shareSuccess'));
    } catch {
      setMessage(t('messages.shareError'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        maxLength={SHARE_NAME_MAX_LENGTH}
        placeholder={t('labels.namePlaceholder')}
        aria-label={t('labels.namePlaceholder')}
        title={t('labels.nameHint')}
        suppressHydrationWarning
        className="border-border bg-surface focus:border-primary w-full rounded-full border px-3 py-1.5 text-sm outline-none"
      />
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => handleDownload('landscape')}
          disabled={busy}
          className="border-border bg-surface hover:bg-background inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-all duration-150 ease-out active:scale-95 disabled:opacity-60"
        >
          {busy && format === 'landscape' ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <Tv2 className="h-4 w-4" aria-hidden />
          )}
          {t('actions.shareLandscape')}
        </button>
        <button
          type="button"
          onClick={() => handleDownload('portrait')}
          disabled={busy}
          className="border-border bg-surface hover:bg-background inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-all duration-150 ease-out active:scale-95 disabled:opacity-60"
        >
          {busy && format === 'portrait' ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <Smartphone className="h-4 w-4" aria-hidden />
          )}
          {t('actions.sharePortrait')}
        </button>
      </div>
      {message ? (
        <p className="text-muted text-xs" role="status">
          <ImageDown className="mr-1 inline h-3 w-3" aria-hidden />
          {message}
        </p>
      ) : null}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          left: -10000,
          top: -10000,
          pointerEvents: 'none',
          opacity: 0,
        }}
      >
        <ShareCard
          ref={cardRef}
          records={records}
          format={format}
          generatedAt={generatedAt}
          name={name.trim()}
        />
      </div>
    </div>
  );
}
