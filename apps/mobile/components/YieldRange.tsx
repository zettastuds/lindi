/**
 * Honesty-model yield display (PRD §9.4). Variable presets show a RANGE bar with a
 * distinct floor marker; the near-fixed preset shows a single value. Never a fake
 * guaranteed % for variable strategies — enforced here, not just in copy.
 */
import { View } from 'react-native';
import type { PresetInfo } from '@lindi/shared';
import { pct } from '../lib/format';
import { Text } from './ui/Text';

export function YieldRange({ info }: { info: PresetInfo }) {
  if (info.nearFixed) {
    return (
      <View>
        <Text className="font-pot text-[24px] text-ink-900">~{pct(info.blendedApy)}</Text>
        <Text variant="caption" className="text-info">
          lantai treasury · hampir tetap
        </Text>
      </View>
    );
  }

  // range bar: low ── mid ── high
  const span = info.apyHigh - info.apyLow || 1;
  const midPos = ((info.blendedApy - info.apyLow) / span) * 100;

  return (
    <View>
      <Text className="font-pot text-[24px] text-ink-900">
        {pct(info.apyLow)}–{pct(info.apyHigh)}
      </Text>
      <View className="h-2 bg-paper-sunken rounded-pill mt-2 overflow-hidden">
        <View className="h-full bg-lime-300 rounded-pill" style={{ width: '100%' }} />
      </View>
      <View
        className="absolute"
        style={{ left: `${Math.max(0, Math.min(100, midPos))}%`, top: 30 }}
      >
        <View className="w-1 h-3 bg-ink-900 rounded-pill" />
      </View>
      <Text variant="caption" className="text-ink-400 mt-2">
        kisaran · tergantung hasil variabel · tanpa jaminan
      </Text>
    </View>
  );
}
