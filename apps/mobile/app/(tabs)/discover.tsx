/**
 * Discover / Jelajah — the social-discovery surface (PRD §12.8 / D16). Browse open
 * public pools by interest tag, search, and sort; join people with shared goals.
 * The "grow your people" half of the thesis. Mock-backed via `data.listPublicPools`.
 */
import { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Search } from 'lucide-react-native';
import type { Circle, PublicPoolFilter } from '@lindi/shared';
import { color } from '@lindi/tokens';
import { data } from '../../lib/datasource';
import { Input, Screen, SegmentedControl, TagChip, Text } from '../../components/ui';
import { PoolCard } from '../../components/PoolCard';

type Sort = NonNullable<PublicPoolFilter['sort']>;

const SORTS: { value: Sort; label: string }[] = [
  { value: 'size', label: 'Terbesar' },
  { value: 'apy', label: 'Hasil' },
  { value: 'recent', label: 'Terbaru' },
];

export default function Discover() {
  const [tags, setTags] = useState<{ slug: string; label: string; count: number }[]>([]);
  const [pools, setPools] = useState<Circle[]>([]);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [sort, setSort] = useState<Sort>('size');

  useEffect(() => {
    data.listTags().then(setTags);
  }, []);

  useEffect(() => {
    data
      .listPublicPools({
        query: query || undefined,
        tags: selected.length ? selected : undefined,
        sort,
      })
      .then(setPools);
  }, [query, selected, sort]);

  const toggleTag = (slug: string) =>
    setSelected((prev) => (prev.includes(slug) ? prev.filter((t) => t !== slug) : [...prev, slug]));

  return (
    <Screen scroll>
      <Animated.View entering={FadeInDown.duration(420)} className="mt-1 mb-4">
        <Text variant="display">Temukan circle-mu</Text>
        <Text variant="caption" className="mt-1">
          Gabung pool terbuka sesuai tujuanmu. Uangnya tumbuh, temannya nyambung.
        </Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(80).duration(420)} className="mb-3">
        <Input
          value={query}
          onChangeText={setQuery}
          placeholder="Cari pool (umroh, sekolah, usaha)"
          leftIcon={<Search size={18} color={color.ink[400]} strokeWidth={2} />}
        />
      </Animated.View>

      {/* Tag filters */}
      <Animated.View entering={FadeInDown.delay(140).duration(420)} className="mb-3">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2 pr-4">
          {tags.map((t) => (
            <TagChip
              key={t.slug}
              label={t.label}
              selected={selected.includes(t.slug)}
              onPress={() => toggleTag(t.slug)}
            />
          ))}
        </ScrollView>
      </Animated.View>

      {/* Sort */}
      <Animated.View entering={FadeInDown.delay(200).duration(420)} className="mb-4">
        <SegmentedControl options={SORTS} value={sort} onChange={setSort} />
      </Animated.View>

      <View className="flex-row items-center justify-between mb-2">
        <Text variant="caption">{pools.length} pool terbuka</Text>
      </View>

      {pools.map((c, i) => (
        <Animated.View key={c.id} entering={FadeInDown.delay(120 + i * 70).duration(440)}>
          <PoolCard circle={c} />
        </Animated.View>
      ))}

      {pools.length === 0 && (
        <View className="items-center py-12">
          <Text variant="h2" className="text-ink-400">
            Tidak ada hasil
          </Text>
          <Text variant="caption" className="mt-1">
            Coba ubah kata kunci atau filter tag.
          </Text>
        </View>
      )}
    </Screen>
  );
}
