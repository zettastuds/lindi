/**
 * Create-Circle flow (PRD §12.2). A single-scroll, sectioned form presented as a
 * modal route (/create). Sections render conditionally by selected mode. Builds a
 * CreateCircleInput from form state and hands it to the data seam.
 */
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import {
  CircleMode,
  Preset,
  type CreateCircleInput,
  type PresetInfo,
} from '@lindi/shared';
import { data } from '../lib/datasource';
import {
  Button,
  Input,
  Screen,
  SectionHeader,
  TagChip,
  Text,
  Toggle,
} from '../components/ui';
import { ModePicker } from '../components/ModePicker';
import { PresetChip } from '../components/PresetChip';

type Tag = { slug: string; label: string; count: number };

export default function CreateCircle() {
  const router = useRouter();

  // ---- form state ----
  const [mode, setMode] = useState<CircleMode>(CircleMode.ClassicRotating);
  const [name, setName] = useState('');
  const [preset, setPreset] = useState<Preset | null>(null);
  const [autoCompound, setAutoCompound] = useState(true);

  // schedule (Arisan + Tujuan)
  const [contributionAmount, setContributionAmount] = useState('');
  const [roundDurationDays, setRoundDurationDays] = useState('');
  const [totalRounds, setTotalRounds] = useState('');

  // goal (Tujuan)
  const [goalLabel, setGoalLabel] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [goalDate, setGoalDate] = useState('');

  // public (Publik)
  const [tierMin, setTierMin] = useState('');
  const [cap, setCap] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // ---- loaded data ----
  const [presets, setPresets] = useState<PresetInfo[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      const [p, t] = await Promise.all([data.getPresets(), data.listTags()]);
      if (!alive) return;
      setPresets(p);
      setTags(t);
    })();
    return () => {
      alive = false;
    };
  }, []);

  const isSchedule =
    mode === CircleMode.ClassicRotating || mode === CircleMode.GoalBased;
  const isGoal = mode === CircleMode.GoalBased;
  const isPublic = mode === CircleMode.PublicPool;

  const canSubmit = name.trim().length > 0 && preset !== null && !submitting;

  const toggleTag = (slug: string) =>
    setSelectedTags((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );

  const onSubmit = async () => {
    if (!canSubmit || preset === null) return;
    setSubmitting(true);
    const input: CreateCircleInput = {
      mode,
      name: name.trim(),
      preset,
      autoCompound,
      ...(isSchedule && {
        contributionAmount: contributionAmount || undefined,
        roundDurationDays: roundDurationDays
          ? Number(roundDurationDays)
          : undefined,
        totalRounds: totalRounds ? Number(totalRounds) : undefined,
      }),
      ...(isGoal && {
        goalLabel: goalLabel || undefined,
        goalAmount: goalAmount || undefined,
        goalDate: goalDate || undefined,
      }),
      ...(isPublic && {
        isPublic: true,
        tierMin: tierMin || undefined,
        cap: cap || undefined,
        tags: selectedTags.length ? selectedTags : undefined,
      }),
    };
    try {
      await data.buildCreateCircle(input);
      router.back();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen>
      <Animated.View entering={FadeInDown.delay(40).duration(420)}>
        <Text variant="h1" className="mt-2 mb-1">
          Buat circle baru
        </Text>
        <Text variant="body" className="text-ink-500 mb-6">
          Pilih cara menabung, lalu atur detailnya.
        </Text>
      </Animated.View>

      {/* 1. Mode */}
      <Animated.View
        entering={FadeInDown.delay(80).duration(420)}
        className="mb-6"
      >
        <SectionHeader title="Jenis circle" />
        <ModePicker value={mode} onChange={setMode} />
      </Animated.View>

      {/* 2. Name */}
      <Animated.View
        entering={FadeInDown.delay(120).duration(420)}
        className="mb-6"
      >
        <Input
          label="Nama circle"
          placeholder="Arisan keluarga"
          value={name}
          onChangeText={setName}
        />
      </Animated.View>

      {/* 3. Schedule */}
      {isSchedule && (
        <Animated.View
          entering={FadeInDown.delay(160).duration(420)}
          className="mb-6 gap-4"
        >
          <SectionHeader title="Jadwal" />
          <Input
            label="Setoran per ronde"
            prefix="$"
            placeholder="50"
            keyboardType="numeric"
            value={contributionAmount}
            onChangeText={setContributionAmount}
          />
          <Input
            label="Durasi ronde (hari)"
            placeholder="30"
            keyboardType="numeric"
            value={roundDurationDays}
            onChangeText={setRoundDurationDays}
          />
          <Input
            label="Jumlah ronde"
            placeholder="12"
            keyboardType="numeric"
            value={totalRounds}
            onChangeText={setTotalRounds}
          />
        </Animated.View>
      )}

      {/* 4. Goal */}
      {isGoal && (
        <Animated.View
          entering={FadeInDown.delay(200).duration(420)}
          className="mb-6 gap-4"
        >
          <SectionHeader title="Tujuan" />
          <Input
            label="Nama tujuan"
            placeholder="Umroh"
            value={goalLabel}
            onChangeText={setGoalLabel}
          />
          <Input
            label="Target dana"
            prefix="$"
            placeholder="3000"
            keyboardType="numeric"
            value={goalAmount}
            onChangeText={setGoalAmount}
          />
          <Input
            label="Target tanggal"
            placeholder="2027-04"
            value={goalDate}
            onChangeText={setGoalDate}
          />
        </Animated.View>
      )}

      {/* 5. Public */}
      {isPublic && (
        <Animated.View
          entering={FadeInDown.delay(200).duration(420)}
          className="mb-6 gap-4"
        >
          <SectionHeader title="Pengaturan pool" />
          <Input
            label="Setoran minimum"
            prefix="$"
            placeholder="25"
            keyboardType="numeric"
            value={tierMin}
            onChangeText={setTierMin}
          />
          <Input
            label="Batas pool (opsional)"
            prefix="$"
            placeholder="10000"
            keyboardType="numeric"
            value={cap}
            onChangeText={setCap}
          />
          <View>
            <Text variant="caption" className="mb-2 text-ink-700 font-body-strong">
              Tag minat
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {tags.map((t) => (
                <TagChip
                  key={t.slug}
                  label={t.label}
                  selected={selectedTags.includes(t.slug)}
                  onPress={() => toggleTag(t.slug)}
                />
              ))}
            </View>
          </View>
        </Animated.View>
      )}

      {/* 6. Strategi */}
      <Animated.View
        entering={FadeInDown.delay(240).duration(420)}
        className="mb-6"
      >
        <SectionHeader title="Strategi" />
        <View className="flex-row gap-2 items-stretch">
          {presets.map((p) => (
            <PresetChip
              key={p.preset}
              info={p}
              selected={p.preset === preset}
              onPress={() => setPreset(p.preset)}
            />
          ))}
        </View>
      </Animated.View>

      {/* 7. Auto-compound */}
      <Animated.View
        entering={FadeInDown.delay(280).duration(420)}
        className="mb-8"
      >
        <Toggle
          label="Bunga berbunga otomatis"
          helper="Hasil otomatis diputar lagi"
          value={autoCompound}
          onValueChange={setAutoCompound}
        />
      </Animated.View>

      {/* 8. Submit */}
      <Animated.View entering={FadeInDown.delay(320).duration(420)}>
        <Button
          label="Buat Circle"
          loading={submitting}
          disabled={!canSubmit}
          onPress={onSubmit}
        />
      </Animated.View>
    </Screen>
  );
}
