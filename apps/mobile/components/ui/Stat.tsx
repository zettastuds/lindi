/**
 * Stat — a label + value pair. Money uses the rounded pot font. tone colors the value.
 */
import { View } from 'react-native';
import { Text } from './Text';

type Tone = 'ink' | 'success' | 'danger' | 'info';
const toneClass: Record<Tone, string> = {
  ink: 'text-ink-900',
  success: 'text-success',
  danger: 'text-danger',
  info: 'text-info',
};

export function Stat({
  label,
  value,
  tone = 'ink',
  mono = false,
}: {
  label: string;
  value: string;
  tone?: Tone;
  mono?: boolean;
}) {
  return (
    <View>
      <Text variant="caption">{label}</Text>
      <Text
        className={`${mono ? 'font-pot text-[22px]' : 'font-body-strong text-[18px]'} ${toneClass[tone]} mt-0.5`}
      >
        {value}
      </Text>
    </View>
  );
}
