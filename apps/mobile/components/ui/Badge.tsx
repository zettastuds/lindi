/**
 * Small status pill. tone maps to semantic colors (BRAND §3.4).
 * Default uses lime tint; semantic tones for money/states.
 */
import { View } from 'react-native';
import { Text } from './Text';

type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

const toneClass: Record<Tone, { bg: string; text: string }> = {
  neutral: { bg: 'bg-lime-100', text: 'text-lime-800' },
  success: { bg: 'bg-success-soft', text: 'text-success' },
  warning: { bg: 'bg-[#FBF0D6]', text: 'text-warning' },
  danger: { bg: 'bg-danger-soft', text: 'text-danger' },
  info: { bg: 'bg-[#DCE9E7]', text: 'text-info' },
};

export function Badge({ label, tone = 'neutral' }: { label: string; tone?: Tone }) {
  const c = toneClass[tone];
  return (
    <View className={`self-start rounded-pill px-3 py-1 ${c.bg}`}>
      <Text variant="caption" className={`${c.text} font-body-strong`}>
        {label}
      </Text>
    </View>
  );
}
