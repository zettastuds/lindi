/**
 * Public-pool card for the Discover feed (PRD §12.8). Shows headline, interest tags,
 * pot size, member count, tier minimum, and an honesty-correct APY label
 * (Conservative = "hampir tetap"; variable presets = "bervariasi", never a guarantee).
 */
import { Link } from 'expo-router';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Preset, type Circle } from '@lindi/shared';
import { color } from '@lindi/tokens';
import { idr, pct, usd } from '../lib/format';
import { Card } from './ui/Card';
import { Text } from './ui/Text';
import { TagChip } from './ui/TagChip';

export function PoolCard({ circle }: { circle: Circle }) {
  const nearFixed = circle.preset === Preset.Conservative;
  const apyNote = nearFixed ? 'hampir tetap' : 'bervariasi';

  return (
    <Link href={`/circle/${circle.id}`} asChild>
      <Pressable>
        <Card className="mb-3">
          <View className="flex-row items-start justify-between mb-1">
            <View className="flex-1 pr-3">
              <Text variant="h2">{circle.name}</Text>
              {circle.headline ? (
                <Text variant="caption" className="mt-0.5">
                  {circle.headline}
                </Text>
              ) : null}
            </View>
            <View className="flex-row items-center gap-1 bg-success-soft rounded-pill px-2.5 h-7">
              <Ionicons name="trending-up" size={13} color={color.success} />
              <Text variant="caption" className="text-success font-body-strong">
                ≈ {pct(circle.apy)}/thn
              </Text>
            </View>
          </View>

          <Text variant="caption" className="text-ink-400 mb-3">
            {apyNote} · {circle.memberCount} anggota
          </Text>

          {circle.tags?.length ? (
            <View className="flex-row flex-wrap gap-2 mb-3">
              {circle.tags.slice(0, 3).map((t) => (
                <TagChip key={t} label={t} />
              ))}
            </View>
          ) : null}

          <View className="flex-row items-end justify-between">
            <View>
              <Text className="font-pot text-[24px] leading-[28px] text-ink-900">
                {usd(circle.potValue)}
              </Text>
              <Text variant="caption">{idr(circle.potValueIdr)}</Text>
            </View>
            {circle.tierMin ? (
              <View className="items-end">
                <Text variant="caption" className="text-ink-400">
                  Mulai dari
                </Text>
                <Text variant="bodyStrong" className="text-ink-700">
                  {usd(circle.tierMin)}
                </Text>
              </View>
            ) : null}
          </View>
        </Card>
      </Pressable>
    </Link>
  );
}
