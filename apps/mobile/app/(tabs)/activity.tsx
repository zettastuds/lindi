/**
 * Activity / Aktivitas tab — notifications + the transparent ledger feed (PRD §12.6).
 * Reuses NotificationItem + ActivityItem. Mock-backed.
 */
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import type { ActivityEvent, Notification } from '@lindi/shared';
import { data } from '../../lib/datasource';
import { Card, Divider, Screen, SegmentedControl, Text } from '../../components/ui';
import { NotificationItem } from '../../components/NotificationItem';
import { ActivityItem } from '../../components/ActivityItem';

type Tab = 'notif' | 'ledger';

export default function ActivityScreen() {
  const [tab, setTab] = useState<Tab>('notif');
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [events, setEvents] = useState<ActivityEvent[]>([]);

  useEffect(() => {
    (async () => {
      const u = await data.getCurrentUser();
      setNotifs(await data.getNotifications(u.id));
      const mine = await data.listMyCircles(u.id);
      const all = (await Promise.all(mine.map((c) => data.getActivity(c.id)))).flat();
      all.sort((a, b) => b.occurredAt.localeCompare(a.occurredAt));
      setEvents(all);
    })();
  }, []);

  return (
    <Screen>
      <Animated.View entering={FadeInDown.duration(420)} className="mt-1 mb-4">
        <Text variant="display">Aktivitas</Text>
        <Text variant="caption" className="mt-1">
          Semua yang terjadi di tabunganmu, transparan.
        </Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(80).duration(420)} className="mb-4">
        <SegmentedControl
          options={[
            { value: 'notif', label: 'Notifikasi' },
            { value: 'ledger', label: 'Riwayat' },
          ]}
          value={tab}
          onChange={setTab}
        />
      </Animated.View>

      {tab === 'notif' ? (
        <Card>
          {notifs.map((n, i) => (
            <View key={n.id}>
              {i > 0 && <Divider />}
              <NotificationItem notif={n} />
            </View>
          ))}
          {notifs.length === 0 && <Text variant="caption">Belum ada notifikasi.</Text>}
        </Card>
      ) : (
        <Card>
          {events.map((e, i) => (
            <View key={e.id}>
              {i > 0 && <Divider />}
              <ActivityItem event={e} />
            </View>
          ))}
          {events.length === 0 && <Text variant="caption">Belum ada aktivitas.</Text>}
        </Card>
      )}
    </Screen>
  );
}
