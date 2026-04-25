'use client';

import { useCallback, useRef } from 'react';

interface Options {
  durationMs?: number;
  moveTolerance?: number;
}

interface Handlers<E extends Element> {
  onPointerDown: (e: React.PointerEvent<E>) => void;
  onPointerUp: (e: React.PointerEvent<E>) => void;
  onPointerLeave: (e: React.PointerEvent<E>) => void;
  onPointerMove: (e: React.PointerEvent<E>) => void;
  onContextMenu: (e: React.MouseEvent<E>) => void;
}

export function useLongPress<E extends Element = Element>(
  onLongPress: () => void,
  options: Options = {}
): Handlers<E> {
  const { durationMs = 450, moveTolerance = 8 } = options;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startRef = useRef<{ x: number; y: number } | null>(null);
  const firedRef = useRef(false);

  const clear = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    startRef.current = null;
  }, []);

  return {
    onPointerDown: (e) => {
      firedRef.current = false;
      startRef.current = { x: e.clientX, y: e.clientY };
      timerRef.current = setTimeout(() => {
        firedRef.current = true;
        onLongPress();
      }, durationMs);
    },
    onPointerUp: () => {
      clear();
    },
    onPointerLeave: () => {
      clear();
    },
    onPointerMove: (e) => {
      const start = startRef.current;
      if (!start) return;
      if (
        Math.abs(e.clientX - start.x) > moveTolerance ||
        Math.abs(e.clientY - start.y) > moveTolerance
      ) {
        clear();
      }
    },
    onContextMenu: (e) => {
      // Prevent the long press from opening the OS context menu on touch devices.
      if (firedRef.current) {
        e.preventDefault();
      }
    },
  };
}
