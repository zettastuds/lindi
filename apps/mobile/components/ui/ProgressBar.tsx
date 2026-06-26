/**
 * Progress bar. `value` 0..1. Optional label row above. tone selects fill color.
 */
import { View } from 'react-native';
import { clamp01 } from '../../lib/format';

type Tone = 'lime' | 'success' | 'info';
const fill: Record<Tone, string> = {
  lime: 'bg-lime-500',
  success: 'bg-success',
  info: 'bg-info',
};

export function ProgressBar({
  value,
  tone = 'lime',
  className = '',
}: {
  value: number;
  tone?: Tone;
  className?: string;
}) {
  return (
    <View className={`h-2 bg-paper-sunken rounded-pill overflow-hidden ${className}`}>
      <View
        className={`h-full rounded-pill ${fill[tone]}`}
        style={{ width: `${clamp01(value) * 100}%` }}
      />
    </View>
  );
}
