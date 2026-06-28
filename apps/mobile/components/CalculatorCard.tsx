/**
 * Presents a ProjectionResult honestly (PRD §9.4 honesty model):
 * - near-fixed (Conservative) preset shows a single months-to-goal figure;
 * - variable presets show a RANGE (monthsLow..monthsHigh), never a single
 *   guaranteed duration.
 * Final projected value sits next to a distinct, protected floor value.
 */
import { View } from 'react-native';
import { type ProjectionResult } from '@lindi/shared';
import { usd } from '../lib/format';
import { Card, Text, AnimatedNumber, Badge, Divider } from './ui';

export function CalculatorCard({
  result,
  nearFixed,
}: {
  result: ProjectionResult;
  nearFixed: boolean;
}) {
  return (
    <Card elevated>
      {/* Months to goal — single number only when near-fixed, else a range. */}
      <Text variant="caption">Perkiraan waktu mencapai target</Text>
      {nearFixed ? (
        <View className="flex-row items-baseline mt-1">
          <AnimatedNumber
            value={result.monthsToGoal}
            format={(n) => `${Math.round(n)}`}
            className="font-pot text-[34px] text-ink-900"
          />
          <Text variant="body" className="text-ink-500 ml-2">
            bulan
          </Text>
        </View>
      ) : (
        <View className="flex-row items-baseline mt-1">
          <Text className="font-pot text-[34px] text-ink-900">
            {result.monthsLow}
            <Text className="font-pot text-[34px] text-ink-400">–</Text>
            {result.monthsHigh}
          </Text>
          <Text variant="body" className="text-ink-500 ml-2">
            bulan
          </Text>
        </View>
      )}
      {!nearFixed && (
        <View className="mt-2">
          <Badge label="kisaran, tanpa jaminan" tone="info" />
        </View>
      )}

      <Divider className="my-4" />

      {/* Final projected value next to the distinct protected floor. */}
      <View className="flex-row justify-between">
        <View className="flex-1">
          <Text variant="caption">Nilai akhir perkiraan</Text>
          <AnimatedNumber
            value={Number(result.finalValue)}
            format={usd}
            className="font-pot text-[22px] text-success mt-0.5"
          />
        </View>
        <View className="flex-1 pl-4 border-l border-border-hair">
          <Text variant="caption">Dasar terlindungi</Text>
          <AnimatedNumber
            value={Number(result.floorValue)}
            format={usd}
            className="font-pot text-[22px] text-info mt-0.5"
          />
          <Text variant="caption" className="text-ink-400 mt-1">
            Nilai yang dijaga dalam dolar.
          </Text>
        </View>
      </View>

      {result.recommendation && (
        <View className="mt-4 rounded-sm bg-lime-50 p-3">
          <Text variant="caption" className="text-ink-700 font-body-strong">
            Saran
          </Text>
          <Text variant="body" className="text-ink-700 mt-0.5">
            {result.recommendation}
          </Text>
        </View>
      )}
    </Card>
  );
}
