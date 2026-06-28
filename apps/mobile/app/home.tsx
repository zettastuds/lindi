/**
 * Home / Beranda — the daily hook (PRD §12.0). Hero aggregate balance with the
 * purchasing-power-protected counter, animated growing numbers, a mode filter, and
 * the user's circles with staggered entrance. Built to make people feel "wow".
 * All data via the mock `data` source (DATA-MODEL §8) — swap to live later.
 */
import { useEffect, useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { CircleMode, type Circle, type Notification, type User } from '@lindi/shared';
import { color, gradient } from '@lindi/tokens';
import { data } from '../lib/datasource';
import { idr } from '../lib/format';
import { AnimatedNumber, Avatar, IconButton, Screen, SegmentedControl, Text } from '../components/ui';
import { CircleCard } from '../components/CircleCard';
import { ProtectCounter } from '../components/ProtectCounter';

type Filter = 'ALL' | CircleMode;

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'ALL', label: 'Semua' },
  { value: CircleMode.ClassicRotating, label: 'Arisan' },
  { value: CircleMode.GoalBased, label: 'Tujuan' },
  { value: CircleMode.PublicPool, label: 'Publik' },
];

function QuickAction({
  icon,
  label,
  onPress,
  primary,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  primary?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-1 rounded-md px-4 py-4 flex-row items-center gap-2.5 ${
        primary ? 'bg-lime-500 active:bg-lime-600' : 'bg-paper-raised border border-border-hair active:bg-paper-sunken'
      }`}
    >
      <Ionicons name={icon} size={20} color={color.ink[900]} />
      <Text variant="bodyStrong" className="text-ink-900 flex-1">
        {label}
      </Text>
    </Pressable>
  );
}

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [circles, setCircles] = useState<Circle[]>([]);
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<Filter>('ALL');

  useEffect(() => {
    (async () => {
      const u = await data.getCurrentUser();
      setUser(u);
      setCircles(await data.listMyCircles(u.id));
      setNotifs(await data.getNotifications(u.id));
    })();
  }, []);

  const unread = notifs.filter((n) => !n.readAt).length;

  const totals = useMemo(() => {
    const usdSum = circles.reduce((a, c) => a + Number(c.potValue), 0);
    const idrSum = circles.reduce((a, c) => a + Number(c.potValueIdr), 0);
    const yieldSum = circles.reduce((a, c) => a + Number(c.totalYieldEarned), 0);
    return { usdSum, idrSum, yieldSum };
  }, [circles]);

  const shown = filter === 'ALL' ? circles : circles.filter((c) => c.mode === filter);

  return (
    <Screen>
      {/* Header */}
      <Animated.View entering={FadeInDown.duration(420)} className="flex-row items-center justify-between mt-2 mb-5">
        <View className="flex-row items-center gap-3">
          <Avatar name={user?.displayName ?? 'L'} size="md" />
          <View>
            <Text variant="caption">Selamat datang,</Text>
            <Text variant="h1">{user?.displayName ?? 'Lindi'}</Text>
          </View>
        </View>
        <View>
          <IconButton name="notifications-outline" />
          {unread > 0 && (
            <View className="absolute -top-1 -right-1 bg-danger rounded-pill min-w-5 h-5 px-1 items-center justify-center">
              <Text variant="caption" className="text-paper-base font-body-strong">
                {unread}
              </Text>
            </View>
          )}
        </View>
      </Animated.View>

      {/* Hero aggregate balance */}
      <Animated.View entering={FadeInDown.delay(80).duration(480)}>
        <LinearGradient
          colors={gradient.hero}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ borderRadius: 22 }}
        >
          <View className="p-6">
            <Text variant="caption" className="text-ink-700">
              Total tabungan kamu
            </Text>
            <AnimatedNumber
              value={totals.usdSum}
              format={(n) =>
                new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)
              }
              className="font-pot text-[44px] leading-[50px] text-ink-900 mt-1"
            />
            <View className="flex-row items-center gap-2 mt-1">
              <Text variant="body" className="text-ink-700">
                {idr(totals.idrSum)}
              </Text>
              <View className="flex-row items-center gap-1 bg-success-soft rounded-pill px-2 py-0.5">
                <Ionicons name="trending-up" size={12} color={color.success} />
                <Text variant="caption" className="text-success font-body-strong">
                  +{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totals.yieldSum)}
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Protect counter */}
      <Animated.View entering={FadeInDown.delay(160).duration(480)} className="mt-3">
        {/* illustrative: protected ≈ value × the documented decade depreciation drag */}
        <ProtectCounter baseIdr={Math.round(totals.idrSum * 0.33)} />
      </Animated.View>

      {/* Quick actions */}
      <Animated.View entering={FadeInDown.delay(240).duration(480)} className="flex-row gap-3 mt-4">
        <QuickAction icon="add-circle" label="Buat Circle" primary onPress={() => router.push('/home')} />
        <QuickAction icon="compass" label="Jelajah" onPress={() => router.push('/discover')} />
      </Animated.View>

      {/* Circle list */}
      <Animated.View entering={FadeInDown.delay(320).duration(480)} className="mt-6 mb-3">
        <View className="flex-row items-center justify-between mb-3">
          <Text variant="h2">Circle kamu</Text>
          <Text variant="caption">{circles.length} circle</Text>
        </View>
        <SegmentedControl options={FILTERS} value={filter} onChange={setFilter} />
      </Animated.View>

      {shown.map((c, i) => (
        <Animated.View key={c.id} entering={FadeInDown.delay(380 + i * 70).duration(460)}>
          <CircleCard circle={c} />
        </Animated.View>
      ))}

      {shown.length === 0 && (
        <View className="items-center py-10">
          <Text variant="caption">Belum ada circle di kategori ini.</Text>
        </View>
      )}
    </Screen>
  );
}
