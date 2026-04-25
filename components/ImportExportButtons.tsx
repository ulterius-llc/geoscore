'use client';

import { useRef, useState } from 'react';
import { Download, RotateCcw, Upload } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { ExportPayload, Status, StatusRecord } from '../lib/types';
import { COUNTRY_BY_ID } from '../lib/countries';
import { STATUS_ORDER } from '../lib/scoring';

interface ImportExportButtonsProps {
  records: StatusRecord;
  onImport: (records: StatusRecord) => void;
  onReset: () => void;
}

function buildExport(records: StatusRecord): ExportPayload {
  return {
    app: 'geoscore',
    version: 1,
    exportedAt: new Date().toISOString(),
    records,
  };
}

function isStatus(value: unknown): value is Status {
  return (
    typeof value === 'string' && (STATUS_ORDER as string[]).includes(value)
  );
}

function parseImport(text: string): StatusRecord | null {
  try {
    const data = JSON.parse(text) as unknown;
    if (!data || typeof data !== 'object') return null;
    const obj = data as { records?: unknown };
    const raw =
      obj.records && typeof obj.records === 'object'
        ? (obj.records as Record<string, unknown>)
        : (data as Record<string, unknown>);
    const next: StatusRecord = {};
    for (const [id, value] of Object.entries(raw)) {
      if (!isStatus(value)) continue;
      if (value === 'never') continue;
      if (!COUNTRY_BY_ID.has(id)) continue;
      next[id] = value;
    }
    return next;
  } catch {
    return null;
  }
}

export function ImportExportButtons({
  records,
  onImport,
  onReset,
}: ImportExportButtonsProps) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);

  function handleExport() {
    const payload = buildExport(records);
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const stamp = new Date().toISOString().slice(0, 10);
    link.download = `geoscore-${stamp}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  async function handleFile(file: File) {
    const text = await file.text();
    const parsed = parseImport(text);
    if (!parsed) {
      setMessage(t('messages.importInvalid'));
      return;
    }
    onImport(parsed);
    setMessage(
      t('messages.importSuccess', { count: Object.keys(parsed).length })
    );
  }

  function handleReset() {
    if (typeof window !== 'undefined') {
      const ok = window.confirm(t('messages.resetConfirm'));
      if (!ok) return;
    }
    onReset();
    setMessage(null);
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleExport}
          className="border-border bg-surface hover:bg-background inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-all duration-150 ease-out active:scale-95"
        >
          <Download className="h-4 w-4" aria-hidden />
          {t('actions.export')}
        </button>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="border-border bg-surface hover:bg-background inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-all duration-150 ease-out active:scale-95"
        >
          <Upload className="h-4 w-4" aria-hidden />
          {t('actions.import')}
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="border-border bg-surface hover:bg-background hover:text-foreground text-muted inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-all duration-150 ease-out active:scale-95"
        >
          <RotateCcw className="h-4 w-4" aria-hidden />
          {t('actions.reset')}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleFile(file);
            e.target.value = '';
          }}
        />
      </div>
      {message ? (
        <p className="text-muted text-xs" role="status">
          {message}
        </p>
      ) : null}
    </div>
  );
}
