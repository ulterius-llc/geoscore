'use client';

import { ChevronDown, Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { MapDef, Place } from '../lib/maps/types';
import { SCORE_MAP } from '../lib/scoring';
import type { Status, StatusRecord } from '../lib/types';
import { useActiveMap } from './GeoScoreProvider';
import { StatusSelector } from './StatusSelector';
import { useCountryName } from './useCountryName';
import { useStatusColors } from './useStatusColors';
import { useStatusLabel } from './useStatusLabel';

interface CountryListPanelProps {
  records: StatusRecord;
  selectedId: string | null;
  onSelect: (placeId: string) => void;
  onChangeStatus: (placeId: string, status: Status) => void;
}

export function CountryListPanel({
  records,
  selectedId,
  onSelect,
  onChangeStatus,
}: CountryListPanelProps) {
  const { t } = useTranslation();
  const map = useActiveMap();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const [openSubgroups, setOpenSubgroups] = useState<Record<string, boolean>>(
    {}
  );
  const [query, setQuery] = useState('');
  const getName = useCountryName();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    return map.places
      .filter(
        (p) =>
          p.name_ja.toLowerCase().includes(q) ||
          p.name_en.toLowerCase().includes(q) ||
          p.code.toLowerCase().includes(q)
      )
      .sort((a, b) => getName(a).localeCompare(getName(b)));
  }, [query, getName, map.places]);

  function toggleGroup(group: string, mapDef: MapDef) {
    const wasOpen = openGroups[group] ?? false;
    setOpenGroups((prev) => ({ ...prev, [group]: !wasOpen }));
    if (wasOpen) {
      const subgroups = mapDef.subgroupsByGroup[group] ?? [];
      setOpenSubgroups((prev) => {
        const next = { ...prev };
        for (const sub of subgroups) delete next[sub];
        return next;
      });
    }
  }
  function toggleSubgroup(sub: string) {
    setOpenSubgroups((prev) => ({ ...prev, [sub]: !prev[sub] }));
  }

  return (
    <section className="border-border bg-surface rounded-2xl border p-3 sm:p-4">
      <div className="relative mb-3">
        <Search
          className="text-muted pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
          aria-hidden
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('labels.searchPlaceholder')}
          className="border-border bg-background focus:border-foreground w-full rounded-full border py-2 pr-9 pl-9 text-sm transition-colors outline-none"
        />
        {query ? (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="text-muted hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2 rounded-full p-1 transition-colors"
            aria-label={t('actions.close')}
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      {filtered ? (
        <ul className="divide-border divide-y">
          {filtered.length === 0 ? (
            <li className="text-muted px-2 py-6 text-center text-sm">
              {t('labels.noResults')}
            </li>
          ) : (
            filtered.map((place) => (
              <PlaceRow
                key={place.id}
                place={place}
                status={records[place.id] ?? 'never'}
                isSelected={place.id === selectedId}
                onSelect={() => onSelect(place.id)}
                onChangeStatus={(s) => onChangeStatus(place.id, s)}
              />
            ))
          )}
        </ul>
      ) : (
        <ul className="space-y-2">
          {map.groups.map((group) => {
            const subgroups = map.subgroupsByGroup[group] ?? [];
            const groupPlaces = map.placesByGroup[group] ?? [];
            if (groupPlaces.length === 0) return null;
            const visited = groupPlaces.filter(
              (p) => records[p.id] && records[p.id] !== 'never'
            ).length;
            const open = openGroups[group] ?? false;
            const hasSubgroups = subgroups.length > 1;
            return (
              <li
                key={group}
                className="border-border overflow-hidden rounded-xl border"
              >
                <button
                  type="button"
                  className="bg-surface hover:bg-background flex w-full items-center justify-between px-3 py-2.5 text-left transition-colors"
                  aria-expanded={open}
                  onClick={() => toggleGroup(group, map)}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {t(`${map.groupKeyPrefix}.${group}`)}
                    </span>
                    <span className="text-muted text-xs tabular-nums">
                      {visited} / {groupPlaces.length}
                    </span>
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                    aria-hidden
                  />
                </button>
                <Collapse open={open}>
                  {hasSubgroups ? (
                    <ul className="bg-background space-y-1 px-2 py-2">
                      {subgroups.map((sub) => {
                        const subPlaces = map.placesBySubgroup[sub] ?? [];
                        if (subPlaces.length === 0) return null;
                        const subVisited = subPlaces.filter(
                          (p) => records[p.id] && records[p.id] !== 'never'
                        ).length;
                        const subOpen = openSubgroups[sub] ?? false;
                        return (
                          <li
                            key={sub}
                            className="border-border bg-surface overflow-hidden rounded-lg border"
                          >
                            <button
                              type="button"
                              className="hover:bg-background flex w-full items-center justify-between px-3 py-2 text-left transition-colors"
                              aria-expanded={subOpen}
                              onClick={() => toggleSubgroup(sub)}
                            >
                              <span className="flex items-center gap-2">
                                <span className="text-foreground text-sm">
                                  {t(`${map.subgroupKeyPrefix}.${sub}`)}
                                </span>
                                <span className="text-muted text-xs tabular-nums">
                                  {subVisited} / {subPlaces.length}
                                </span>
                              </span>
                              <ChevronDown
                                className={`h-4 w-4 transition-transform duration-200 ${subOpen ? 'rotate-180' : ''}`}
                                aria-hidden
                              />
                            </button>
                            <Collapse open={subOpen}>
                              <ul className="divide-border bg-background divide-y">
                                {subPlaces.map((place) => (
                                  <PlaceRow
                                    key={place.id}
                                    place={place}
                                    status={records[place.id] ?? 'never'}
                                    isSelected={place.id === selectedId}
                                    onSelect={() => onSelect(place.id)}
                                    onChangeStatus={(s) =>
                                      onChangeStatus(place.id, s)
                                    }
                                  />
                                ))}
                              </ul>
                            </Collapse>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <ul className="divide-border bg-background divide-y">
                      {groupPlaces.map((place) => (
                        <PlaceRow
                          key={place.id}
                          place={place}
                          status={records[place.id] ?? 'never'}
                          isSelected={place.id === selectedId}
                          onSelect={() => onSelect(place.id)}
                          onChangeStatus={(s) => onChangeStatus(place.id, s)}
                        />
                      ))}
                    </ul>
                  )}
                </Collapse>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

interface CollapseProps {
  open: boolean;
  children: React.ReactNode;
}

function Collapse({ open, children }: CollapseProps) {
  return (
    <div
      className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out ${
        open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
      }`}
      aria-hidden={!open}
    >
      <div className="min-h-0 overflow-hidden">{children}</div>
    </div>
  );
}

interface PlaceRowProps {
  place: Place;
  status: Status;
  isSelected: boolean;
  onSelect: () => void;
  onChangeStatus: (status: Status) => void;
}

function PlaceRow({
  place,
  status,
  isSelected,
  onSelect,
  onChangeStatus,
}: PlaceRowProps) {
  const { t } = useTranslation();
  const colors = useStatusColors();
  const getName = useCountryName();
  const statusLabel = useStatusLabel();
  return (
    <li
      className={`px-3 py-2 transition-colors duration-150 ${isSelected ? 'bg-background' : ''}`}
    >
      <button
        type="button"
        onClick={onSelect}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <span className="flex min-w-0 items-center gap-2.5">
          <span
            aria-hidden
            className="border-border inline-block h-3.5 w-3.5 shrink-0 rounded-sm border transition-colors duration-200"
            style={{ backgroundColor: colors[status] }}
          />
          <span className="min-w-0 truncate text-sm">{getName(place)}</span>
        </span>
        <span className="text-muted shrink-0 text-xs tabular-nums">
          {statusLabel(status)}{' '}
          {t('labels.scoreFormat', { n: SCORE_MAP[status] })}
        </span>
      </button>
      <Collapse open={isSelected}>
        <div className="pt-2.5">
          <StatusSelector value={status} onChange={onChangeStatus} size="sm" />
        </div>
      </Collapse>
    </li>
  );
}
