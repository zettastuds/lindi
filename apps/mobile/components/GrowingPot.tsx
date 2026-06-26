/**
 * The signature interaction: the pot value gently ticks up so the money feels
 * alive (BRAND §8). Lime orb gradient ring, USD + IDR + yield-earned (moss, NOT lime).
 * Honesty: yield shown as earned-to-date, never a promised future number.
 */
import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { gradient } from '@lindi/tokens';
import type { Circle } from '@lindi/shared';
import { idr, usd } from '../lib/format';
import { Badge } from './ui/Badge';
import { Text } from './ui/Text';

export function GrowingPot({ circle }: { circle: Circle }) {
  const target = Number(circle.potValue);
  const [display, setDisplay] = useState(target);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Slow "alive" drift upward (mock). Real impl reads live vault share price.
  useEffect(() => {
    setDisplay(target);
    timer.current = setInterval(() => {
      setDisplay((d) => d + target * 0.0000006);
    }, 1000);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [target]);

  return (
    <LinearGradient
      colors={gradient.orb}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ borderRadius: 22 }}
    >
      <View className="p-6 items-center">
        <Text variant="caption" className="text-ink-700 mb-1">
          Total tabungan circle
        </Text>
        <Text className="font-pot text-[44px] leading-[48px] text-ink-900">
          {usd(display)}
        </Text>
        <Text variant="caption" className="text-ink-700 mt-1">
          {idr(circle.potValueIdr)}
        </Text>
        <View className="mt-3">
          <Badge tone="success" label={`+${usd(circle.totalYieldEarned)} hasil`} />
        </View>
      </View>
    </LinearGradient>
  );
}
