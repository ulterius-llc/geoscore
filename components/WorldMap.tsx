'use client';

import { RotateCcw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ComposableMap,
  Geographies,
  Geography,
  Sphere,
  ZoomableGroup,
} from 'react-simple-maps';
import type { MapDef } from '../lib/maps/types';
import { STATUS_COLORS, STATUS_DARK_COLORS } from '../lib/scoring';
import type { Status, StatusRecord } from '../lib/types';
import { useActiveMap } from './GeoScoreProvider';

interface WorldMapProps {
  records: StatusRecord;
  selectedId: string | null;
  onSelect: (placeId: string) => void;
  map?: MapDef;
}

export function WorldMap({
  records,
  selectedId,
  onSelect,
  map: explicitMap,
}: WorldMapProps) {
  const contextMap = useActiveMap();
  const map = explicitMap ?? contextMap;

  const [isDark, setIsDark] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [dirty, setDirty] = useState(false);

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

  const initialZoom = isMobile
    ? map.view.initialZoomMobile
    : map.view.initialZoomDesktop;
  const initialCenter: [number, number] = isMobile
    ? langJa && map.view.initialCenterMobileJa
      ? map.view.initialCenterMobileJa
      : map.view.initialCenterMobile
    : map.view.initialCenterDesktop;

  function handleClick(placeId: string) {
    onSelect(placeId);
  }

  function handleResetClick() {
    if (!dirty) return;
    setResetKey((k) => k + 1);
    setDirty(false);
  }

  const aspectClass =
    map.kind === 'us'
      ? 'aspect-3/4 sm:aspect-16/10 lg:aspect-980/580'
      : 'aspect-3/4 sm:aspect-16/10 lg:aspect-980/520';

  const showSphere = map.kind === 'world';

  return (
    <div
      className="geo-map relative w-full overflow-hidden rounded-2xl"
      style={{ backgroundColor: oceanFill }}
    >
      <div className={aspectClass}>
        <ComposableMap
          key={`${map.kind}-${resetKey}`}
          projection={map.projection.name}
          width={map.projection.width}
          height={map.projection.height}
          projectionConfig={map.projection.config}
          preserveAspectRatio={map.projection.preserveAspectRatio}
          style={{ width: '100%', height: '100%', display: 'block' }}
        >
          <ZoomableGroup
            center={initialCenter}
            zoom={initialZoom}
            minZoom={map.view.minZoom}
            maxZoom={map.view.maxZoom}
            translateExtent={map.view.translateExtent}
            onMoveStart={() => setDirty(true)}
            filterZoomEvent={
              ((event: { type: string }) =>
                event.type !== 'dblclick') as unknown as (
                element: SVGElement
              ) => boolean
            }
          >
            {showSphere ? (
              <Sphere
                id="sphere"
                stroke="transparent"
                strokeWidth={0}
                fill={oceanFill}
              />
            ) : null}
            <Geographies geography={map.geographyUrl}>
              {({ geographies: geos }) =>
                geos.map((geo) => {
                  const placeId = map.resolveId(
                    typeof geo.id === 'string' ? geo.id : undefined,
                    geo.properties?.name
                  );
                  const place = placeId ? map.placeById.get(placeId) : null;
                  const status: Status = place
                    ? (records[place.id] ?? 'never')
                    : 'never';
                  const isSelected = place?.id === selectedId;
                  const fill = colors[status];
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onClick={() => {
                        if (place) handleClick(place.id);
                      }}
                      style={{
                        default: {
                          fill,
                          stroke: isSelected ? selectedStroke : borderColor,
                          strokeWidth: isSelected ? 1.4 : 0.4,
                          outline: 'none',
                          cursor: place ? 'pointer' : 'default',
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
