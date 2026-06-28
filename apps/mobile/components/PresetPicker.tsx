/**
 * Reusable preset selector — a horizontal row of selectable cards.
 * Reuses the domain PresetChip (which itself enforces the honesty model:
 * variable presets render as ranges, never a single guaranteed %).
 */
import { View } from 'react-native';
import { type Preset, type PresetInfo } from '@lindi/shared';
import { PresetChip } from './PresetChip';

export function PresetPicker({
  presets,
  value,
  onChange,
}: {
  presets: PresetInfo[];
  value: Preset;
  onChange: (p: Preset) => void;
}) {
  return (
    <View className="flex-row gap-2 items-stretch">
      {presets.map((p) => (
        <PresetChip
          key={p.preset}
          info={p}
          selected={p.preset === value}
          onPress={() => onChange(p.preset)}
        />
      ))}
    </View>
  );
}
