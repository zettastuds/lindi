/**
 * Segmented control — e.g. switch circle mode (Arisan / Tujuan / Publik).
 * Generic over a string union of options.
 */
import { Pressable, View } from 'react-native';
import { Text } from './Text';

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <View className="flex-row bg-paper-sunken rounded-pill p-1">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            className={`flex-1 rounded-pill py-2 items-center ${active ? 'bg-paper-raised' : ''}`}
            style={active ? { elevation: 1 } : undefined}
          >
            <Text
              variant="caption"
              className={`font-body-strong ${active ? 'text-ink-900' : 'text-ink-500'}`}
            >
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
