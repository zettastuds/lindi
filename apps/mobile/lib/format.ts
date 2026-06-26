/**
 * Display formatting. Money lives as decimal strings everywhere; format only at
 * the edge for display. Bahasa-first (id-ID) per BRAND voice.
 */

/** USDC decimal string -> "$2,240.00" */
export function usd(value: string | number): string {
  const n = typeof value === 'string' ? Number(value) : value;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Number.isFinite(n) ? n : 0);
}

/** IDR decimal string -> "Rp35.840.000" */
export function idr(value: string | number): string {
  const n = typeof value === 'string' ? Number(value) : value;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number.isFinite(n) ? n : 0);
}

/** 5.6 -> "5,6%" (variable presets should be shown as ranges, not single — see UI). */
export function pct(value: number): string {
  return `${value.toLocaleString('id-ID', { maximumFractionDigits: 1 })}%`;
}

/** 0..1 progress -> clamped */
export function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}
