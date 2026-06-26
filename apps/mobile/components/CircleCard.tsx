/**
 * Circle list item. Tapping routes to the circle room. Shows mode + value + a
 * goal progress bar (GOAL) or round progress (CLASSIC).
 */
import { Link } from 'expo-router';
import { Pressable, View } from 'react-native';
import { CircleMode, type Circle } from '@lindi/shared';
import { clamp01, idr, pct, usd } from '../lib/format';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Text } from './ui/Text';

const modeLabel: Record<string, string> = {
  [CircleMode.ClassicRotating]: 'Arisan',
  [CircleMode.GoalBased]: 'Tujuan',
  [CircleMode.PublicPool]: 'Publik',
};

function progress(circle: Circle): number {
  if (circle.mode === CircleMode.GoalBased && circle.goalAmount) {
    return clamp01(Number(circle.potValue) / Number(circle.goalAmount));
  }
  if (circle.totalRounds && circle.currentRound) {
    return clamp01(circle.currentRound / circle.totalRounds);
  }
  return 0;
}

export function CircleCard({ circle }: { circle: Circle }) {
  const p = progress(circle);
  return (
    <Link href={`/circle/${circle.id}`} asChild>
      <Pressable>
        <Card className="mb-3">
          <View className="flex-row items-center justify-between mb-2">
            <Text variant="h2">{circle.goalLabel ?? circle.name}</Text>
            <Badge label={modeLabel[circle.mode] ?? circle.mode} />
          </View>

          <Text className="font-pot text-[28px] leading-[32px] text-ink-900">
            {usd(circle.potValue)}
          </Text>
          <Text variant="caption">{idr(circle.potValueIdr)}</Text>

          <View className="h-2 bg-paper-sunken rounded-pill mt-3 overflow-hidden">
            <View
              className="h-full bg-lime-500 rounded-pill"
              style={{ width: `${p * 100}%` }}
            />
          </View>

          <View className="flex-row items-center justify-between mt-2">
            <Text variant="caption">
              {circle.memberCount} anggota · {pct(circle.apy)}/thn
            </Text>
            <Text variant="caption" className="text-success font-body-strong">
              +{usd(circle.totalYieldEarned)}
            </Text>
          </View>
        </Card>
      </Pressable>
    </Link>
  );
}
