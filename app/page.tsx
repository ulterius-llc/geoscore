'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BottomNav, type MobileView } from '../components/BottomNav';
import { ContinentBadges } from '../components/ContinentBadges';
import { CountryBottomSheet } from '../components/CountryBottomSheet';
import { CountryListPanel } from '../components/CountryListPanel';
import { Footer } from '../components/Footer';
import { useGeoScore } from '../components/GeoScoreProvider';
import { Header } from '../components/Header';
import { ImportExportButtons } from '../components/ImportExportButtons';
import { Legend } from '../components/Legend';
import { ScoreSummary } from '../components/ScoreSummary';
import { SelectedCountryCard } from '../components/SelectedCountryCard';
import { ShareImagePanel } from '../components/ShareImagePanel';
import { nextStatus } from '../lib/scoring';
import type { Status } from '../lib/types';

const WorldMap = dynamic(
  () => import('../components/WorldMap').then((m) => m.WorldMap),
  { ssr: false }
);

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const { records, ready, setStatus, replaceAll, resetAll } = useGeoScore();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [view, setView] = useState<MobileView>('home');
  const [sheetOpen, setSheetOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(max-width: 1023.98px)');
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.title = t('app.documentTitle');
    document.documentElement.lang = i18n.language?.startsWith('ja')
      ? 'ja'
      : 'en';
  }, [t, i18n.language]);

  const selectFromMap = useCallback(
    (id: string) => {
      setSelectedId(id);
      if (isMobile) setSheetOpen(true);
    },
    [isMobile]
  );

  const cycleStatus = useCallback(
    (id: string) => {
      const current: Status = records[id] ?? 'never';
      setStatus(id, nextStatus(current));
      setSelectedId(id);
    },
    [records, setStatus]
  );

  if (!ready) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <span className="text-muted text-sm">{t('app.loading')}</span>
      </main>
    );
  }

  const homeMobile = view === 'home' ? 'flex' : 'hidden';
  const listMobile = view === 'list' ? 'flex' : 'hidden';
  const shareMobile = view === 'share' ? 'flex' : 'hidden';

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-4 pb-24 lg:py-6 lg:pb-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className={`${homeMobile} min-w-0 flex-col gap-4 lg:flex`}>
            <WorldMap
              records={records}
              selectedId={selectedId}
              onSelect={selectFromMap}
              onCycle={cycleStatus}
            />
            <Legend />
            <p className="text-muted -mt-1 text-[11px]">
              {t('messages.interactionHint')}
            </p>
            <div className="hidden lg:block">
              <SelectedCountryCard
                selectedId={selectedId}
                records={records}
                onChangeStatus={setStatus}
                onClear={() => setSelectedId(null)}
              />
            </div>
            <ScoreSummary records={records} />
            <ContinentBadges records={records} />
            <div className="hidden flex-col gap-3 sm:flex-row sm:items-start sm:justify-between lg:flex">
              <ImportExportButtons
                records={records}
                onImport={replaceAll}
                onReset={resetAll}
              />
              <ShareImagePanel records={records} />
            </div>
          </section>

          <section
            className={`${listMobile} flex-col gap-4 lg:sticky lg:top-20 lg:flex lg:max-h-[calc(100vh-6rem)] lg:overflow-auto`}
          >
            <CountryListPanel
              records={records}
              selectedId={selectedId}
              onSelect={(id) => {
                setSelectedId(id);
                if (isMobile) {
                  setSheetOpen(true);
                }
              }}
              onChangeStatus={setStatus}
            />
          </section>

          <section className={`${shareMobile} flex-col gap-4 lg:hidden`}>
            <div className="border-border bg-surface rounded-2xl border p-4">
              <h2 className="mb-3 text-sm font-semibold">
                {t('labels.ioTitle')}
              </h2>
              <ImportExportButtons
                records={records}
                onImport={replaceAll}
                onReset={resetAll}
              />
            </div>
            <div className="border-border bg-surface rounded-2xl border p-4">
              <h2 className="mb-3 text-sm font-semibold">
                {t('labels.shareTitle')}
              </h2>
              <ShareImagePanel records={records} />
            </div>
          </section>
        </div>

        <Footer />
      </main>

      <CountryBottomSheet
        open={sheetOpen}
        selectedId={selectedId}
        records={records}
        onChangeStatus={setStatus}
        onClose={() => setSheetOpen(false)}
      />

      <BottomNav value={view} onChange={setView} />
    </>
  );
}
