/**
 * STYLE GUIDE — the first screen. Showcases every component, divided by section,
 * so the team can see the whole design system at a glance (BRAND.md made tangible).
 * In production this route would move behind a dev flag; for now it's the landing page.
 */
import { useState } from 'react';
import { View } from 'react-native';
import { Link } from 'expo-router';
import { Heart, Plus, Share2 } from 'lucide-react-native';
import { color } from '@lindi/tokens';
import { CircleMode, fixtures, Preset, type PresetInfo } from '@lindi/shared';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Chip,
  Divider,
  EmptyState,
  IconButton,
  Input,
  ListRow,
  ProgressBar,
  Screen,
  SectionHeader,
  SegmentedControl,
  Logo,
  Skeleton,
  Stat,
  Text,
  Toggle,
} from '../components/ui';
import { GrowingPot } from '../components/GrowingPot';
import { CircleCard } from '../components/CircleCard';
import { PresetChip } from '../components/PresetChip';
import { YieldRange } from '../components/YieldRange';
import { MemberRow } from '../components/MemberRow';
import { ActivityItem } from '../components/ActivityItem';
import { NotificationItem } from '../components/NotificationItem';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="mb-8">
      <Text variant="caption" className="text-lime-700 font-body-strong uppercase mb-3">
        {title}
      </Text>
      {children}
    </View>
  );
}

function Swatch({ name, hex }: { name: string; hex: string }) {
  return (
    <View className="items-center mr-3 mb-3" style={{ width: 64 }}>
      <View
        className="w-14 h-14 rounded-md border border-border-hair"
        style={{ backgroundColor: hex }}
      />
      <Text variant="caption" className="mt-1 text-center">
        {name}
      </Text>
    </View>
  );
}

const presetInfos: PresetInfo[] = [
  { preset: Preset.Conservative, label: 'Aman', blendedApy: 3.5, apyLow: 3, apyHigh: 4, nearFixed: true, claim: 'Dijamin treasury' },
  { preset: Preset.Balanced, label: 'Seimbang', blendedApy: 5.6, apyLow: 5, apyHigh: 6, nearFixed: false, claim: 'Lantai + variabel' },
  { preset: Preset.Growth, label: 'Tumbuh', blendedApy: 8, apyLow: 7, apyHigh: 9, nearFixed: false, claim: 'Potensi lebih tinggi' },
];

export default function StyleGuide() {
  const [toggle, setToggle] = useState(true);
  const [chip, setChip] = useState('a');
  const [seg, setSeg] = useState<string>(CircleMode.GoalBased);
  const [preset, setPreset] = useState<Preset>(Preset.Balanced);

  return (
    <Screen>
      {/* Header */}
      <View className="flex-row items-center justify-between mt-2 mb-6">
        <View>
          <Logo variant="wordmark" height={28} />
          <Text variant="caption" className="mt-1">Design system showcase</Text>
        </View>
        <Link href="/" asChild>
          <Button label="Buka app" variant="secondary" onPress={() => {}} />
        </Link>
      </View>

      <Section title="Warna · Paper & Ink">
        <View className="flex-row flex-wrap">
          <Swatch name="paper.base" hex={color.paper.base} />
          <Swatch name="paper.raised" hex={color.paper.raised} />
          <Swatch name="paper.sunken" hex={color.paper.sunken} />
          <Swatch name="ink.900" hex={color.ink[900]} />
          <Swatch name="ink.500" hex={color.ink[500]} />
        </View>
      </Section>

      <Section title="Warna · Lime (brand)">
        <View className="flex-row flex-wrap">
          <Swatch name="300 accent" hex={color.lime[300]} />
          <Swatch name="500 primary" hex={color.lime[500]} />
          <Swatch name="600" hex={color.lime[600]} />
          <Swatch name="700" hex={color.lime[700]} />
          <Swatch name="og backup" hex={color.lime.brandOg} />
        </View>
      </Section>

      <Section title="Warna · Semantik">
        <View className="flex-row flex-wrap">
          <Swatch name="success" hex={color.success} />
          <Swatch name="warning" hex={color.warning} />
          <Swatch name="danger" hex={color.danger} />
          <Swatch name="info" hex={color.info} />
        </View>
      </Section>

      <Section title="Tipografi">
        <Card>
          <Text variant="display">Display 32</Text>
          <Text variant="h1">Heading 1 · 24</Text>
          <Text variant="h2">Heading 2 · 20</Text>
          <Text variant="body">Body 16 — teks utama aplikasi.</Text>
          <Text variant="bodyStrong">Body strong 16</Text>
          <Text variant="caption">Caption 13 — meta & helper</Text>
          <Text className="font-pot text-[32px] text-ink-900 mt-1">$1,234.56</Text>
        </Card>
      </Section>

      <Section title="Tombol">
        <View className="gap-3">
          <Button label="Primary" onPress={() => {}} />
          <Button label="Secondary" variant="secondary" onPress={() => {}} />
          <Button label="Ghost" variant="ghost" onPress={() => {}} />
          <Button label="Loading" loading onPress={() => {}} />
          <Button label="Disabled" disabled onPress={() => {}} />
          <View className="flex-row gap-3">
            <IconButton icon={Plus} variant="lime" />
            <IconButton icon={Share2} />
            <IconButton icon={Heart} variant="ghost" />
          </View>
        </View>
      </Section>

      <Section title="Badge">
        <View className="flex-row flex-wrap gap-2">
          <Badge label="Neutral" />
          <Badge tone="success" label="+$41 hasil" />
          <Badge tone="warning" label="Menunggu" />
          <Badge tone="danger" label="Default" />
          <Badge tone="info" label="Terlindungi" />
        </View>
      </Section>

      <Section title="Input">
        <View className="gap-4">
          <Input label="Nama circle" placeholder="cth. Umroh Bersama" />
          <Input label="Jumlah setoran" prefix="$" placeholder="32.00" keyboardType="decimal-pad" />
          <Input label="Username" value="busri" error="Username sudah dipakai" />
        </View>
      </Section>

      <Section title="Toggle · Chip · Segment">
        <Card className="gap-4">
          <Toggle
            label="Auto-compound"
            helper="Hasil diinvestasikan ulang otomatis"
            value={toggle}
            onValueChange={setToggle}
          />
          <Divider />
          <View className="flex-row gap-2">
            <Chip label="Semua" selected={chip === 'a'} onPress={() => setChip('a')} />
            <Chip label="Tujuan" selected={chip === 'b'} onPress={() => setChip('b')} />
            <Chip label="Publik" selected={chip === 'c'} onPress={() => setChip('c')} />
          </View>
          <SegmentedControl
            value={seg}
            onChange={setSeg}
            options={[
              { value: CircleMode.ClassicRotating, label: 'Arisan' },
              { value: CircleMode.GoalBased, label: 'Tujuan' },
              { value: CircleMode.PublicPool, label: 'Publik' },
            ]}
          />
        </Card>
      </Section>

      <Section title="Progress & Avatar">
        <Card className="gap-4">
          <ProgressBar value={0.62} />
          <ProgressBar value={0.35} tone="success" />
          <View className="flex-row gap-3 items-center">
            <Avatar name="Bu Sri" size="sm" />
            <Avatar name="Andi" size="md" />
            <Avatar name="Maya" size="lg" />
          </View>
        </Card>
      </Section>

      <Section title="Stat">
        <Card className="flex-row justify-between">
          <Stat label="Total" value="$2,240" mono />
          <Stat label="Hasil" value="+$41.30" tone="success" mono />
          <Stat label="APY" value="5,6%" tone="info" />
        </Card>
      </Section>

      <Section title="List row">
        <Card>
          <ListRow
            title="Pengaturan circle"
            subtitle="Jadwal, anggota, strategi"
            leading={<Avatar name="U" />}
            showChevron
            onPress={() => {}}
          />
          <Divider />
          <ListRow title="Notifikasi" subtitle="Push & WhatsApp" showChevron onPress={() => {}} />
        </Card>
      </Section>

      <Section title="Skeleton (loading)">
        <Card className="gap-3">
          <Skeleton height={20} className="w-1/2" />
          <Skeleton height={44} radius={16} />
          <Skeleton height={14} className="w-3/4" />
        </Card>
      </Section>

      <Section title="Yield presets (honesty model)">
        <View className="flex-row gap-2 mb-4">
          {presetInfos.map((p) => (
            <PresetChip
              key={p.preset}
              info={p}
              selected={p.preset === preset}
              onPress={() => setPreset(p.preset)}
            />
          ))}
        </View>
        <Card className="gap-4">
          <YieldRange info={presetInfos[0]!} />
          <Divider />
          <YieldRange info={presetInfos[2]!} />
        </Card>
      </Section>

      <Section title="Growing pot">
        <GrowingPot circle={fixtures.goalCircle} />
      </Section>

      <Section title="Circle card">
        <CircleCard circle={fixtures.goalCircle} />
        <CircleCard circle={fixtures.classicCircle} />
      </Section>

      <Section title="Member row">
        <Card>
          {fixtures.goalCircle.members.slice(0, 3).map((m) => (
            <MemberRow key={m.id} member={m} />
          ))}
        </Card>
      </Section>

      <Section title="Activity (transparent ledger)">
        <Card>
          {fixtures.activity.map((e) => (
            <ActivityItem key={e.id} event={e} />
          ))}
        </Card>
      </Section>

      <Section title="Notifications">
        <Card>
          {fixtures.notifications.map((n) => (
            <NotificationItem key={n.id} notif={n} />
          ))}
        </Card>
      </Section>

      <Section title="Empty state">
        <Card>
          <EmptyState
            title="Belum ada circle"
            body="Buat circle pertamamu dan mulai menabung bersama."
            actionLabel="Buat Circle"
            onAction={() => {}}
          />
        </Card>
      </Section>

      <SectionHeader title="Selesai" actionLabel="Ke atas" />
    </Screen>
  );
}
