/**
 * Smoothly animates a number from its previous value to a new one (and supports a
 * gentle live "drift" when paired with a ticking target). JS rAF loop so it runs on
 * web + native identically — the growing-pot/protect-counter "alive" feel (BRAND §8).
 *
 * Money still lives as decimal strings; this only animates the DISPLAY number.
 */
import { useEffect, useRef, useState } from 'react';
import { Text, type AppTextProps } from './Text';

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export interface AnimatedNumberProps extends Omit<AppTextProps, 'children'> {
  value: number;
  format: (n: number) => string;
  durationMs?: number;
}

export function AnimatedNumber({
  value,
  format,
  durationMs = 900,
  ...textProps
}: AnimatedNumberProps) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    fromRef.current = display;
    startRef.current = null;
    const from = fromRef.current;
    const delta = value - from;

    const step = (ts: number) => {
      if (startRef.current === null) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const t = Math.min(1, elapsed / durationMs);
      setDisplay(from + delta * easeOut(t));
      if (t < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, durationMs]);

  return <Text {...textProps}>{format(display)}</Text>;
}
