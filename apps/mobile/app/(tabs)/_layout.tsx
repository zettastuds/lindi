/**
 * App shell — bottom tab bar (PRD §12.0 nav map). Custom premium bar: paper.raised
 * surface, soft shadow, lime active state, with an elevated center "+" FAB that opens
 * the Create-Circle flow. Tabs: Beranda, Jelajah, [+], Aktivitas, Akun.
 */
import { View, Pressable } from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Activity, Compass, Home, Plus, User, type LucideIcon } from 'lucide-react-native';
import { color, shadow } from '@lindi/tokens';
import { Text } from '../../components/ui';

// Minimal shape of the tab bar props we use (avoids depending on the
// @react-navigation/bottom-tabs types, which aren't hoisted under pnpm).
type TabRoute = { key: string; name: string };
type TabBarProps = {
  state: { index: number; routes: TabRoute[] };
  navigation: { navigate: (name: string) => void };
};

const TAB_ICON: Record<string, LucideIcon> = {
  index: Home,
  discover: Compass,
  activity: Activity,
  profile: User,
};
const TAB_LABEL: Record<string, string> = {
  index: 'Beranda',
  discover: 'Jelajah',
  activity: 'Aktivitas',
  profile: 'Akun',
};

function TabBar({ state, navigation }: TabBarProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const routes = state.routes.filter((r) => TAB_ICON[r.name]);
  const left = routes.slice(0, 2);
  const right = routes.slice(2);

  const Item = ({ name, index }: { name: string; index: number }) => {
    const focused = state.index === index;
    const Icon = TAB_ICON[name];
    return (
      <Pressable
        key={name}
        onPress={() => navigation.navigate(name)}
        className="flex-1 items-center justify-center gap-1 py-1"
        accessibilityRole="button"
      >
        <Icon
          size={22}
          color={focused ? color.ink[900] : color.ink[400]}
          strokeWidth={focused ? 2.4 : 2}
        />
        <Text variant="caption" className={focused ? 'text-ink-900 font-body-strong' : 'text-ink-400'}>
          {TAB_LABEL[name]}
        </Text>
      </Pressable>
    );
  };

  return (
    <View
      className="flex-row items-center bg-paper-raised border-t border-border-hair px-2"
      style={[{ paddingBottom: insets.bottom || 8, paddingTop: 8 }, shadow.raised]}
    >
      {left.map((r) => (
        <Item key={r.name} name={r.name} index={state.routes.indexOf(r)} />
      ))}

      {/* Center FAB opens the Create flow */}
      <View className="w-16 items-center">
        <Pressable
          onPress={() => router.push('/create')}
          accessibilityRole="button"
          accessibilityLabel="Buat Circle"
          className="w-14 h-14 rounded-pill bg-lime-500 active:bg-lime-600 items-center justify-center -mt-7"
          style={shadow.raised}
        >
          <Plus size={26} color={color.ink[900]} strokeWidth={2.5} />
        </Pressable>
      </View>

      {right.map((r) => (
        <Item key={r.name} name={r.name} index={state.routes.indexOf(r)} />
      ))}
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="discover" />
      <Tabs.Screen name="activity" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
