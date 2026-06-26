/**
 * Circle room — the heart of the app (PRD §12.2). Growing pot, members + paid
 * status, the group strategy preset, and a contribute CTA. Mock data for now.
 */
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import type { Circle, PresetInfo } from '@lindi/shared';
import { data } from '../../lib/datasource';
import { usd } from '../../lib/format';
import { Badge, Button, Card, Screen, Text } from '../../components/ui';
import { GrowingPot } from '../../components/GrowingPot';
import { PresetChip } from '../../components/PresetChip';

export default function CircleRoom() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [circle, setCircle] = useState<Circle | null>(null);
  const [presets, setPresets] = useState<PresetInfo[]>([]);

  useEffect(() => {
    (async () => {
      const c = await data.getCircle(Number(id));
      setCircle(c);
      setPresets(await data.getPresets());
    })();
  }, [id]);

  if (!circle) {
    return (
      <Screen>
        <Text className="mt-10 text-center">Memuat…</Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <Text variant="h1" className="mb-1">
        {circle.goalLabel ?? circle.name}
      </Text>
      {circle.goalAmount && (
        <Text variant="caption" className="mb-4">
          Target {usd(circle.goalAmount)} · {circle.currentRound}/{circle.totalRounds} ronde
        </Text>
      )}

      <GrowingPot circle={circle} />

      <Text variant="h2" className="mt-6 mb-3">
        Strategi grup
      </Text>
      <View className="flex-row gap-2">
        {presets.map((p) => (
          <PresetChip
            key={p.preset}
            info={p}
            selected={p.preset === circle.preset}
            onPress={() => {}}
          />
        ))}
      </View>

      <Text variant="h2" className="mt-6 mb-3">
        Anggota
      </Text>
      <Card>
        {circle.members.length === 0 ? (
          <Text variant="caption">Pool publik — siapa saja bisa bergabung.</Text>
        ) : (
          circle.members.map((m) => (
            <View
              key={m.id}
              className="flex-row items-center justify-between py-2 border-b border-border-hair last:border-0"
            >
              <View className="flex-row items-center gap-3">
                <View className="w-9 h-9 rounded-pill bg-lime-200 items-center justify-center">
                  <Text variant="bodyStrong" className="text-lime-800">
                    {m.username.slice(0, 1).toUpperCase()}
                  </Text>
                </View>
                <Text variant="body">{m.username}</Text>
              </View>
              {m.hasReceived ? (
                <Badge tone="info" label="sudah dapat" />
              ) : (
                <Badge tone="success" label="lunas" />
              )}
            </View>
          ))
        )}
      </Card>

      <View className="mt-6">
        <Button
          label={`Setor ${usd(circle.contributionAmount ?? '0')}`}
          onPress={async () => {
            await data.buildContribute(circle.id, circle.currentRound ?? 1, circle.contributionAmount ?? '0');
          }}
        />
      </View>
    </Screen>
  );
}
