/**
 * Profile / Akun tab — identity + security + language (PRD §12.0). Reputation is
 * [PROD] (PRD §21.4.1), shown as a coming-soon row. Mock-backed.
 */
import { useEffect, useState } from 'react';
import { Switch, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Bell, ChevronRight, Globe, Info, ShieldCheck, Star } from 'lucide-react-native';
import type { User } from '@lindi/shared';
import { color } from '@lindi/tokens';
import { data } from '../../lib/datasource';
import { Avatar, Badge, Card, Divider, ListRow, Screen, Text } from '../../components/ui';

function RowIcon({ icon: Icon }: { icon: typeof Bell }) {
  return (
    <View className="w-9 h-9 rounded-pill bg-lime-100 items-center justify-center">
      <Icon size={18} color={color.lime[700]} strokeWidth={2} />
    </View>
  );
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [english, setEnglish] = useState(false);

  useEffect(() => {
    data.getCurrentUser().then(setUser);
  }, []);

  return (
    <Screen>
      <Animated.View entering={FadeInDown.duration(420)} className="items-center mt-4 mb-6">
        <Avatar name={user?.displayName ?? 'L'} size="lg" />
        <Text variant="h1" className="mt-3">
          {user?.displayName ?? 'Lindi'}
        </Text>
        <Text variant="caption">@{user?.username ?? 'lindi'}</Text>
      </Animated.View>

      {/* Reputation (PROD) */}
      <Animated.View entering={FadeInDown.delay(80).duration(420)} className="mb-4">
        <Card className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <View className="w-9 h-9 rounded-pill bg-info/10 items-center justify-center">
              <Star size={18} color={color.info} strokeWidth={2} />
            </View>
            <View>
              <Text variant="bodyStrong">Reputasi</Text>
              <Text variant="caption">Riwayat circle yang selesai</Text>
            </View>
          </View>
          <Badge tone="info" label="Segera" />
        </Card>
      </Animated.View>

      {/* Settings */}
      <Animated.View entering={FadeInDown.delay(160).duration(420)}>
        <Card>
          <ListRow
            title="Keamanan"
            subtitle="Sidik jari / Face ID, PIN cadangan"
            leading={<RowIcon icon={ShieldCheck} />}
            showChevron
            onPress={() => {}}
          />
          <Divider />
          <ListRow
            title="Notifikasi"
            subtitle="Push & WhatsApp"
            leading={<RowIcon icon={Bell} />}
            showChevron
            onPress={() => {}}
          />
          <Divider />
          <ListRow
            title="Bahasa"
            subtitle={english ? 'English' : 'Bahasa Indonesia'}
            leading={<RowIcon icon={Globe} />}
            trailing={
              <Switch
                value={english}
                onValueChange={setEnglish}
                trackColor={{ false: color.border.hair, true: color.lime[500] }}
                thumbColor={color.paper.raised}
              />
            }
          />
          <Divider />
          <ListRow
            title="Tentang Lindi"
            leading={<RowIcon icon={Info} />}
            trailing={<ChevronRight size={18} color={color.ink[400]} strokeWidth={2} />}
            onPress={() => {}}
          />
        </Card>
      </Animated.View>
    </Screen>
  );
}
