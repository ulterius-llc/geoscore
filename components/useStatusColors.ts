'use client';

import { useEffect, useState } from 'react';
import { STATUS_COLORS, STATUS_DARK_COLORS } from '../lib/scoring';
import type { Status } from '../lib/types';

export function useStatusColors(): Record<Status, string> {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => setIsDark(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  return isDark ? STATUS_DARK_COLORS : STATUS_COLORS;
}
