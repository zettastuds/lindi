/**
 * Notification row: icon by type, title + body, unread dot, channel hint.
 */
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Channel, NotifType, type Notification } from '@lindi/shared';
import { Text } from './ui/Text';

const icon: Record<string, keyof typeof Ionicons.glyphMap> = {
  [NotifType.PotGrew]: 'trending-up',
  [NotifType.ContributionDue]: 'time',
  [NotifType.ContributionReceived]: 'checkmark-circle',
  [NotifType.PayoutReady]: 'gift',
  [NotifType.VoteOpen]: 'people',
  [NotifType.VoteResolved]: 'checkmark-done',
  [NotifType.GoalReached]: 'trophy',
  [NotifType.DefaultAlert]: 'alert-circle',
  [NotifType.Invite]: 'mail',
  [NotifType.EarlyExitProposed]: 'exit',
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
        <Ionicons name={icon[notif.type] ?? 'notifications'} size={18} color="#69791A" />
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
