/**
 * Yield Calculator (PRD §9.4 / YIELD-ENGINE §4). Two modes:
 * - "Simpel": project growth from modal awal + setoran/bulan.
 * - "Target": same, plus a target amount/date to estimate time-to-goal.
 *
 * Everything renders honestly: variable presets show ranges, never a single
 * guaranteed number. A "USD vs tabungan lokal" block frames the chosen preset's
 * dollar APY in real purchasing-power terms against local Indonesian instruments.
 */
import { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Calculator, Target, TrendingUp } from 'lucide-react-native';
import {
  Preset,
  type PresetInfo,
  type ProjectionResult,
} from '@lindi/shared';
import { color } from '@lindi/tokens';
import { data } from '../lib/datasource';
import { pct } from '../lib/format';
import {
  Screen,
  Card,
  Input,
  Text,
  SegmentedControl,
  SectionHeader,
  Divider,
} from '../components/ui';
import { PresetPicker } from '../components/PresetPicker';
import { CalculatorCard } from '../components/CalculatorCard';

type Mode = 'simple' | 'target';

// Local instruments expressed in REAL USD purchasing-power terms, assuming
// ~2,9%/yr rupiah depreciation (10-year trend). These are framing, not advice.
const LOCAL_COMPARISON: { label: string; realUsd: number }[] = [
  { label: 'Deposito', realUsd: 0.6 },
  { label: 'Reksadana Pasar Uang', realUsd: 1.6 },
  { label: 'ORI', realUsd: 3.6 },
];

export default function CalculatorScreen() {
  const [mode, setMode] = useState<Mode>('simple');
  const [presets, setPresets] = useState<PresetInfo[]>([]);
  const [preset, setPreset] = useState<Preset>(Preset.Balanced);

  const [principal, setPrincipal] = useState('500');
  const [monthlyContribution, setMonthlyContribution] = useState('100');
  const [targetAmount, setTargetAmount] = useState('5000');
  const [targetDate, setTargetDate] = useState('2027-04');

  const [result, setResult] = useState<ProjectionResult | null>(null);

  useEffect(() => {
    (async () => {
      setPresets(await data.getPresets());
    })();
  }, []);

  // Recompute the projection on any input/preset/mode change.
  useEffect(() => {
    let alive = true;
    (async () => {
      const r = await data.project({
        principal,
        monthlyContribution,
        preset,
        targetAmount: mode === 'target' ? targetAmount : undefined,
        targetDate: mode === 'target' ? targetDate : undefined,
      });
      if (alive) setResult(r);
    })();
    return () => {
      alive = false;
    };
  }, [principal, monthlyContribution, preset, targetAmount, targetDate, mode]);

  const activePreset = useMemo(
    () => presets.find((p) => p.preset === preset),
    [presets, preset],
  );

  const lindiCompareText = activePreset
    ? activePreset.nearFixed
      ? pct(activePreset.blendedApy)
      : `${pct(activePreset.apyLow)}–${pct(activePreset.apyHigh)}`
    : '-';

  return (
    <Screen>
      <Animated.View entering={FadeInDown.delay(0).duration(420)}>
        <View className="flex-row items-center mt-1 mb-1">
          <Calculator size={22} color={color.ink[900]} strokeWidth={2} />
          <Text variant="h1" className="ml-2">
            Kalkulator
          </Text>
        </View>
        <Text variant="caption" className="mb-4">
          Lihat perkiraan pertumbuhan tabunganmu dalam dolar.
        </Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(60).duration(420)} className="mb-4">
        <SegmentedControl
          options={[
            { value: 'simple', label: 'Simpel' },
            { value: 'target', label: 'Target' },
          ]}
          value={mode}
          onChange={setMode}
        />
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(120).duration(420)} className="mb-5">
        <Card>
          <Input
            label="Modal awal"
            prefix="$"
            keyboardType="numeric"
            value={principal}
            onChangeText={setPrincipal}
            className="mb-3"
          />
          <Input
            label="Setoran/bulan"
            prefix="$"
            keyboardType="numeric"
            value={monthlyContribution}
            onChangeText={setMonthlyContribution}
            className={mode === 'target' ? 'mb-3' : ''}
          />
          {mode === 'target' && (
            <>
              <Input
                label="Target"
                prefix="$"
                keyboardType="numeric"
                value={targetAmount}
                onChangeText={setTargetAmount}
                className="mb-3"
              />
              <Input
                label="Tanggal target"
                placeholder="2027-04"
                value={targetDate}
                onChangeText={setTargetDate}
              />
            </>
          )}
        </Card>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(180).duration(420)} className="mb-5">
        <SectionHeader title="Strategi" />
        <PresetPicker presets={presets} value={preset} onChange={setPreset} />
      </Animated.View>

      {result && activePreset && (
        <Animated.View
          entering={FadeInDown.delay(240).duration(420)}
          className="mb-5"
        >
          <CalculatorCard result={result} nearFixed={activePreset.nearFixed} />
        </Animated.View>
      )}

      <Animated.View entering={FadeInDown.delay(300).duration(420)}>
        <SectionHeader title="USD vs tabungan lokal" />
        <Card>
          <View className="flex-row items-center mb-3">
            <TrendingUp size={18} color={color.info} strokeWidth={2} />
            <Text variant="caption" className="ml-2 text-ink-700">
              Daya beli nyata dalam dolar per tahun
            </Text>
          </View>

          {LOCAL_COMPARISON.map((row) => (
            <View key={row.label} className="flex-row justify-between py-2">
              <Text variant="body" className="text-ink-700">
                {row.label}
              </Text>
              <Text className="font-body-strong text-[16px] text-ink-500">
                {pct(row.realUsd)}
              </Text>
            </View>
          ))}

          <Divider className="my-2" />

          <View className="flex-row items-center justify-between py-2">
            <View className="flex-row items-center">
              <Target size={18} color={color.ink[900]} strokeWidth={2} />
              <Text variant="bodyStrong" className="ml-2">
                Lindi
              </Text>
            </View>
            <Text className="font-pot text-[18px] text-success">
              {lindiCompareText}
            </Text>
          </View>

          <Text variant="caption" className="text-ink-400 mt-2">
            Asumsi rupiah melemah ~2,9%/thn (tren 10 tahun), bukan prediksi.
          </Text>
        </Card>
      </Animated.View>
    </Screen>
  );
}
