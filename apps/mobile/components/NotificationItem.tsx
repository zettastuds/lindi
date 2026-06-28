/**
 * Notification row: icon by type, title + body, unread dot, channel hint.
 */
import { View } from 'react-native';
import {
  AlertCircle,
  Bell,
  CheckCircle2,
  CheckCheck,
  Clock,
  Gift,
  LogOut,
  Mail,
  TrendingUp,
  Trophy,
  Users,
  type LucideIcon,
} from 'lucide-react-native';
import { Channel, NotifType, type Notification } from '@lindi/shared';
import { color } from '@lindi/tokens';
import { Text } from './ui/Text';

const icon: Record<string, LucideIcon> = {
  [NotifType.PotGrew]: TrendingUp,
  [NotifType.ContributionDue]: Clock,
  [NotifType.ContributionReceived]: CheckCircle2,
  [NotifType.PayoutReady]: Gift,
  [NotifType.VoteOpen]: Users,
  [NotifType.VoteResolved]: CheckCheck,
  [NotifType.GoalReached]: Trophy,
  [NotifType.DefaultAlert]: AlertCircle,
  [NotifType.Invite]: Mail,
  [NotifType.EarlyExitProposed]: LogOut,
};

const channelLabel: Record<string, string> = {
  [Channel.Push]: 'Push',
  [Channel.WhatsApp]: 'WhatsApp',
  [Channel.InApp]: 'Aplikasi',
};

export function NotificationItem({ notif }: { notif: Notification }) {
  const unread = !notif.readAt;
  return (
    <View className="flex-row items-start py-3">
      <View className="w-9 h-9 rounded-pill bg-lime-100 items-center justify-center mr-3">
        {(() => {
          const Icon = icon[notif.type] ?? Bell;
          return <Icon size={18} color={color.lime[700]} strokeWidth={2} />;
        })()}
      </View>
      <View className="flex-1">
        <View className="flex-row items-center">
          <Text variant="bodyStrong" className="flex-1">
            {notif.title}
          </Text>
          {unread && <View className="w-2 h-2 rounded-pill bg-lime-500 ml-2" />}
        </View>
        <Text variant="caption" className="mt-0.5">
          {notif.body}
        </Text>
        <Text variant="caption" className="text-ink-400 mt-0.5">
          {channelLabel[notif.channel]}
        </Text>
      </View>
    </View>
  );
}
