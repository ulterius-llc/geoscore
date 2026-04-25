'use client';

import { useEffect, useRef, useState } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Sphere,
  ZoomableGroup,
} from 'react-simple-maps';
import { RotateCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { COUNTRY_BY_ID, resolveCountryId } from '../lib/countries';
import { STATUS_COLORS, STATUS_DARK_COLORS } from '../lib/scoring';
import type { Status, StatusRecord } from '../lib/types';

interface WorldMapProps {
  records: StatusRecord;
  selectedId: string | null;
  onSelect: (countryId: string) => void;
  onCycle: (countryId: string) => void;
  geographyUrl?: string;
}

const DEFAULT_GEOGRAPHY = '/world-110m.json';
const LONG_PRESS_MS = 450;
const DOUBLE_TAP_MS = 280;

export function WorldMap({
  records,
  selectedId,
  onSelect,
  onCycle,
  geographyUrl = DEFAULT_GEOGRAPHY,
}: WorldMapProps) {
  const [isDark, setIsDark] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [dirty, setDirty] = useState(false);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressFired = useRef(false);
  const lastTapRef = useRef<{ id: string; time: number } | null>(null);
  const downPosRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const dark = window.matchMedia('(prefers-color-scheme: dark)');
    const mobile = window.matchMedia('(max-width: 1023.98px)');
    const applyDark = () => setIsDark(dark.matches);
    const applyMobile = () => setIsMobile(mobile.matches);
    applyDark();
    applyMobile();
    dark.addEventListener('change', applyDark);
    mobile.addEventListener('change', applyMobile);
    return () => {
      dark.removeEventListener('change', applyDark);
      mobile.removeEventListener('change', applyMobile);
    };
  }, []);

  const colors = isDark ? STATUS_DARK_COLORS : STATUS_COLORS;
  const oceanFill = isDark ? '#0b0d10' : '#e5edf5';
  const borderColor = isDark ? '#0b0d10' : '#ffffff';
  const selectedStroke = isDark ? '#fde68a' : '#0f172a';
  const { t, i18n } = useTranslation();
  const langJa = i18n.language?.startsWith('ja') ?? false;

  const initialZoom = isMobile ? 2.4 : 1.25;
  const initialCenter: [number, number] = isMobile
    ? langJa
      ? [138, 36]
      : [-98, 38]
    : [15, 20];

  function clearLongPress() {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }

  function handleDown(
    e: React.PointerEvent<SVGPathElement>,
    countryId: string
  ) {
    longPressFired.current = false;
    downPosRef.current = { x: e.clientX, y: e.clientY };
    clearLongPress();
    longPressTimer.current = setTimeout(() => {
      longPressFired.current = true;
      onCycle(countryId);
    }, LONG_PRESS_MS);
  }

  function handleMove(e: React.PointerEvent<SVGPathElement>) {
    const start = downPosRef.current;
    if (!start) return;
    if (
      Math.abs(e.clientX - start.x) > 8 ||
      Math.abs(e.clientY - start.y) > 8
    ) {
      clearLongPress();
    }
  }

  function handleClick(countryId: string) {
    clearLongPress();
    if (longPressFired.current) {
      longPressFired.current = false;
      return;
    }
    // eslint-disable-next-line react-hooks/purity
    const now = Date.now();
    const last = lastTapRef.current;
    if (last && last.id === countryId && now - last.time < DOUBLE_TAP_MS) {
      onCycle(countryId);
      lastTapRef.current = null;
      return;
    }
    lastTapRef.current = { id: countryId, time: now };
    onSelect(countryId);
  }

  function handleResetClick() {
    if (!dirty) return;
    setResetKey((k) => k + 1);
    setDirty(false);
  }

  return (
    <div
      className="geo-map relative w-full overflow-hidden rounded-2xl"
      style={{ backgroundColor: oceanFill }}
    >
      <div className="aspect-3/4 sm:aspect-16/10 lg:aspect-980/520">
        <ComposableMap
          key={resetKey}
          projection="geoEqualEarth"
          width={980}
          height={520}
          projectionConfig={{ scale: 175 }}
          preserveAspectRatio="xMidYMid slice"
          style={{ width: '100%', height: '100%', display: 'block' }}
        >
          <ZoomableGroup
            center={initialCenter}
            zoom={initialZoom}
            minZoom={0.85}
            maxZoom={12}
            translateExtent={[
              [-300, -300],
              [1280, 820],
            ]}
            onMoveStart={() => setDirty(true)}
            filterZoomEvent={
              ((event: { type: string }) =>
                event.type !== 'dblclick') as unknown as (
                element: SVGElement
              ) => boolean
            }
          >
            <Sphere
              id="sphere"
              stroke="transparent"
              strokeWidth={0}
              fill={oceanFill}
            />
            <Geographies geography={geographyUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const countryId = resolveCountryId(
                    typeof geo.id === 'string' ? geo.id : undefined,
                    geo.properties?.name
                  );
                  const country = countryId
                    ? COUNTRY_BY_ID.get(countryId)
                    : null;
                  const status: Status = country
                    ? (records[country.id] ?? 'never')
                    : 'never';
                  const isSelected = country?.id === selectedId;
                  const fill = colors[status];
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onPointerDown={(
                        e: React.PointerEvent<SVGPathElement>
                      ) => {
                        if (country) handleDown(e, country.id);
                      }}
                      onPointerMove={handleMove}
                      onPointerUp={() => clearLongPress()}
                      onPointerLeave={() => clearLongPress()}
                      onPointerCancel={() => clearLongPress()}
                      onClick={() => {
                        if (country) handleClick(country.id);
                      }}
                      onDoubleClick={() => {
                        if (country) {
                          clearLongPress();
                          onCycle(country.id);
                        }
                      }}
                      style={{
                        default: {
                          fill,
                          stroke: isSelected ? selectedStroke : borderColor,
                          strokeWidth: isSelected ? 1.4 : 0.4,
                          outline: 'none',
                          cursor: country ? 'pointer' : 'default',
                          transition: 'fill 160ms ease, stroke 160ms ease',
                        },
                        hover: {
                          fill,
                          stroke: selectedStroke,
                          strokeWidth: 1,
                          outline: 'none',
                        },
                        pressed: {
                          fill,
                          outline: 'none',
                        },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      </div>

      <button
        type="button"
        onClick={handleResetClick}
        disabled={!dirty}
        className={`absolute top-3 right-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-transparent transition-opacity duration-200 ${
          dirty
            ? 'text-foreground/70 hover:text-foreground opacity-100'
            : 'text-foreground/40 cursor-default opacity-50'
        }`}
        aria-label={t('actions.resetView')}
        title={t('actions.resetView')}
      >
        <RotateCcw
          key={resetKey}
          className={`h-3.5 w-3.5 ${resetKey > 0 ? 'geo-spin-once' : ''}`}
          aria-hidden
        />
      </button>
    </div>
  );
}
