/**
 * Yield preset selector chip. ENFORCES the honesty model (BRAND/PRD §9.4):
 * Conservative may show a single near-fixed figure; variable presets MUST render
 * as a range. This is a code-level guard, not just copy.
 */
import { Pressable, View } from 'react-native';
import { Preset, type PresetInfo } from '@lindi/shared';
import { pct } from '../lib/format';
import { Text } from './ui/Text';

export function PresetChip({
  info,
  selected,
  onPress,
}: {
  info: PresetInfo;
  selected: boolean;
  onPress: () => void;
}) {
  // Honesty guard: only the near-fixed (Conservative) preset gets a single number.
  const yieldText = info.nearFixed
    ? `~${pct(info.blendedApy)}`
    : `${pct(info.apyLow)}–${pct(info.apyHigh)}`;

  return (
    <Pressable onPress={onPress} className="flex-1">
      <View
        className={`flex-1 rounded-md border-[1.5px] p-4 ${
          selected ? 'border-lime-500 bg-lime-50' : 'border-border-hair bg-paper-raised'
        }`}
      >
        <Text variant="bodyStrong">{info.label}</Text>
        <Text className="font-pot text-[20px] text-ink-900 mt-1">{yieldText}</Text>
        <Text variant="caption" className="mt-1">
          {info.claim}
        </Text>
        {/* spacer pushes the footnote to the bottom so all cards align */}
        <View className="flex-1" />
        <Text variant="caption" className="text-ink-400 mt-2">
          {info.preset === Preset.Conservative ? 'hampir tetap' : 'kisaran · tanpa jaminan'}
        </Text>
      </View>
    </Pressable>
  );
}
