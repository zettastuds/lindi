/**
 * Home: greet the user, show their circles, surface unread notifications, CTAs.
 * All data via the mock `data` source — swap to live later (DATA-MODEL §8).
 */
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import type { Circle, Notification, User } from '@lindi/shared';
import { data } from '../lib/datasource';
import { Button, IconButton, Screen, Text } from '../components/ui';
import { CircleCard } from '../components/CircleCard';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [circles, setCircles] = useState<Circle[]>([]);
  const [notifs, setNotifs] = useState<Notification[]>([]);

  useEffect(() => {
    (async () => {
      const u = await data.getCurrentUser();
      setUser(u);
      setCircles(await data.listMyCircles(u.id));
      setNotifs(await data.getNotifications(u.id));
    })();
  }, []);

  const unread = notifs.filter((n) => !n.readAt).length;

  return (
    <Screen>
      <View className="flex-row items-center justify-between mt-2 mb-5">
        <View>
          <Text variant="caption">Selamat datang,</Text>
          <Text variant="display">{user?.displayName ?? 'Lindi'}</Text>
        </View>
        <View>
          <IconButton name="notifications-outline" />
          {unread > 0 && (
            <View className="absolute -top-1 -right-1 bg-lime-500 rounded-pill min-w-5 h-5 px-1 items-center justify-center">
              <Text variant="caption" className="font-body-strong">
                {unread}
              </Text>
            </View>
          )}
        </View>
      </View>

      <Text variant="h2" className="mb-3">
        Circle kamu
      </Text>

      {circles.map((c) => (
        <CircleCard key={c.id} circle={c} />
      ))}

      <View className="gap-3 mt-3">
        <Button label="Buat Circle baru" onPress={() => {}} />
        <Button label="Jelajahi pool publik" variant="secondary" onPress={() => {}} />
      </View>
    </Screen>
  );
}
