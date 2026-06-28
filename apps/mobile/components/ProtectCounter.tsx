/**
 * The "purchasing-power protected" counter — makes the core thesis tangible on screen
 * (PRD §2.1, §21.5). A running rupiah figure of value protected vs holding cash while
 * the rupiah slips. Drifts upward so it feels alive. Illustrative, honestly framed:
 * it's "protected vs a documented depreciation trend", never a yield promise.
 */
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { color } from '@lindi/tokens';
import { idr } from '../lib/format';
import { AnimatedNumber } from './ui/AnimatedNumber';
import { Text } from './ui/Text';

export function ProtectCounter({ baseIdr }: { baseIdr: number }) {
  const [target, setTarget] = useState(baseIdr);

  // Gentle live drift (~Rp/sec) so the number breathes. Mock; real impl derives from
  // live FX + balance. Tiny magnitude — feel, not fiction.
  useEffect(() => {
    setTarget(baseIdr);
    const t = setInterval(() => setTarget((v) => v + Math.max(1, baseIdr * 0.0000015)), 1200);
    return () => clearInterval(t);
  }, [baseIdr]);

  return (
    <View className="flex-row items-center gap-3 bg-info/10 rounded-md px-4 py-3">
      <View className="w-9 h-9 rounded-pill items-center justify-center" style={{ backgroundColor: color.info }}>
        <Ionicons name="shield-checkmark" size={18} color="#FFFBF1" />
      </View>
      <View className="flex-1">
        <Text variant="caption" className="text-info">
          Daya beli terlindungi
        </Text>
        <AnimatedNumber
          value={target}
          format={(n) => idr(Math.round(n))}
          variant="bodyStrong"
          className="text-info"
          durationMs={1200}
        />
      </View>
      <Text variant="caption" className="text-ink-400 text-right max-w-[96px]">
        vs simpan tunai
      </Text>
    </View>
  );
}
