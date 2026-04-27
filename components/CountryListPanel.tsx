'use client';

import { ChevronDown, Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CONTINENT_ORDER,
  COUNTRIES,
  COUNTRIES_BY_REGION,
  REGIONS_BY_CONTINENT,
} from '../lib/countries';
import { SCORE_MAP } from '../lib/scoring';
import type {
  Continent,
  Country,
  Region,
  Status,
  StatusRecord,
} from '../lib/types';
import { StatusSelector } from './StatusSelector';
import { useCountryName } from './useCountryName';
import { useStatusColors } from './useStatusColors';

interface CountryListPanelProps {
  records: StatusRecord;
  selectedId: string | null;
  onSelect: (countryId: string) => void;
  onChangeStatus: (countryId: string, status: Status) => void;
}

export function CountryListPanel({
  records,
  selectedId,
  onSelect,
  onChangeStatus,
}: CountryListPanelProps) {
  const { t } = useTranslation();
  const [openContinents, setOpenContinents] = useState<Record<string, boolean>>(
    {}
  );
  const [openRegions, setOpenRegions] = useState<Record<string, boolean>>({});
  const [query, setQuery] = useState('');
  const getName = useCountryName();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    return COUNTRIES.filter(
      (c) =>
        c.name_ja.toLowerCase().includes(q) ||
        c.name_en.toLowerCase().includes(q) ||
        c.iso_a3.toLowerCase().includes(q)
    ).sort((a, b) => getName(a).localeCompare(getName(b)));
  }, [query, getName]);

  function toggleContinent(continent: Continent) {
    const wasOpen = openContinents[continent] ?? false;
    setOpenContinents((prev) => ({ ...prev, [continent]: !wasOpen }));
    if (wasOpen) {
      // Closing the parent collapses every nested region too.
      const regions: Region[] = REGIONS_BY_CONTINENT[continent];
      setOpenRegions((prev) => {
        const next = { ...prev };
        for (const region of regions) delete next[region];
        return next;
      });
    }
  }
  function toggleRegion(region: string) {
    setOpenRegions((prev) => ({ ...prev, [region]: !prev[region] }));
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
            filtered.map((country) => (
              <CountryRow
                key={country.id}
                country={country}
                status={records[country.id] ?? 'never'}
                isSelected={country.id === selectedId}
                onSelect={() => onSelect(country.id)}
                onChangeStatus={(s) => onChangeStatus(country.id, s)}
              />
            ))
          )}
        </ul>
      ) : (
        <ul className="space-y-2">
          {CONTINENT_ORDER.map((continent) => {
            const regions = REGIONS_BY_CONTINENT[continent];
            const continentCountries = regions.flatMap(
              (r) => COUNTRIES_BY_REGION[r]
            );
            if (continentCountries.length === 0) return null;
            const visited = continentCountries.filter(
              (c) => records[c.id] && records[c.id] !== 'never'
            ).length;
            const open = openContinents[continent] ?? false;
            const hasSubregions = regions.length > 1;
            return (
              <li
                key={continent}
                className="border-border overflow-hidden rounded-xl border"
              >
                <button
                  type="button"
                  className="bg-surface hover:bg-background flex w-full items-center justify-between px-3 py-2.5 text-left transition-colors"
                  aria-expanded={open}
                  onClick={() => toggleContinent(continent)}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {t(`continent.${continent}`)}
                    </span>
                    <span className="text-muted text-xs tabular-nums">
                      {visited} / {continentCountries.length}
                    </span>
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                    aria-hidden
                  />
                </button>
                <Collapse open={open}>
                  {hasSubregions ? (
                    <ul className="bg-background space-y-1 px-2 py-2">
                      {regions.map((region) => {
                        const regionCountries = COUNTRIES_BY_REGION[region];
                        if (regionCountries.length === 0) return null;
                        const regionVisited = regionCountries.filter(
                          (c) => records[c.id] && records[c.id] !== 'never'
                        ).length;
                        const regionOpen = openRegions[region] ?? false;
                        return (
                          <li
                            key={region}
                            className="border-border bg-surface overflow-hidden rounded-lg border"
                          >
                            <button
                              type="button"
                              className="hover:bg-background flex w-full items-center justify-between px-3 py-2 text-left transition-colors"
                              aria-expanded={regionOpen}
                              onClick={() => toggleRegion(region)}
                            >
                              <span className="flex items-center gap-2">
                                <span className="text-foreground text-sm">
                                  {t(`region.${region}`)}
                                </span>
                                <span className="text-muted text-xs tabular-nums">
                                  {regionVisited} / {regionCountries.length}
                                </span>
                              </span>
                              <ChevronDown
                                className={`h-4 w-4 transition-transform duration-200 ${regionOpen ? 'rotate-180' : ''}`}
                                aria-hidden
                              />
                            </button>
                            <Collapse open={regionOpen}>
                              <ul className="divide-border bg-background divide-y">
                                {regionCountries.map((country) => (
                                  <CountryRow
                                    key={country.id}
                                    country={country}
                                    status={records[country.id] ?? 'never'}
                                    isSelected={country.id === selectedId}
                                    onSelect={() => onSelect(country.id)}
                                    onChangeStatus={(s) =>
                                      onChangeStatus(country.id, s)
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
                      {continentCountries.map((country) => (
                        <CountryRow
                          key={country.id}
                          country={country}
                          status={records[country.id] ?? 'never'}
                          isSelected={country.id === selectedId}
                          onSelect={() => onSelect(country.id)}
                          onChangeStatus={(s) => onChangeStatus(country.id, s)}
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

interface CountryRowProps {
  country: Country;
  status: Status;
  isSelected: boolean;
  onSelect: () => void;
  onChangeStatus: (status: Status) => void;
}

function CountryRow({
  country,
  status,
  isSelected,
  onSelect,
  onChangeStatus,
}: CountryRowProps) {
  const { t } = useTranslation();
  const colors = useStatusColors();
  const getName = useCountryName();
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
          <span className="min-w-0 truncate text-sm">{getName(country)}</span>
        </span>
        <span className="text-muted shrink-0 text-xs tabular-nums">
          {t(`status.${status}`)}{' '}
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
