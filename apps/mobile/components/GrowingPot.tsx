/**
 * The signature interaction: the pot value gently ticks up so the money feels
 * alive (BRAND §8). Lime orb gradient, USD + IDR + yield-earned (moss, NOT lime).
 * Honesty: yield shown as earned-to-date, never a promised future number.
 */
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { gradient } from '@lindi/tokens';
import type { Circle } from '@lindi/shared';
import { idr, usd } from '../lib/format';
import { AnimatedNumber } from './ui/AnimatedNumber';
import { Badge } from './ui/Badge';
import { Text } from './ui/Text';

export function GrowingPot({ circle }: { circle: Circle }) {
  const base = Number(circle.potValue);
  const [target, setTarget] = useState(base);

  // Slow "alive" drift upward (mock). Real impl reads live vault share price.
  useEffect(() => {
    setTarget(base);
    const timer = setInterval(() => setTarget((d) => d + base * 0.0000009), 1500);
    return () => clearInterval(timer);
  }, [base]);

  return (
    <Animated.View entering={FadeIn.duration(500)}>
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
          <AnimatedNumber
            value={target}
            format={(n) => usd(n)}
            className="font-pot text-[44px] leading-[48px] text-ink-900"
            durationMs={1500}
          />
          <Text variant="caption" className="text-ink-700 mt-1">
            {idr(circle.potValueIdr)}
          </Text>
          <View className="mt-3">
            <Badge tone="success" label={`+${usd(circle.totalYieldEarned)} hasil`} />
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}
