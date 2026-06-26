/**
 * One row in the transparent ledger (PRD §12.6). Maps an ActivityEvent to an icon +
 * human, Bahasa-first sentence. No crypto words.
 */
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ActivityType, type ActivityEvent } from '@lindi/shared';
import { Text } from './ui/Text';

const meta: Record<string, { icon: keyof typeof Ionicons.glyphMap; tint: string }> = {
  [ActivityType.Contributed]: { icon: 'arrow-down-circle', tint: '#5A8A2C' },
  [ActivityType.PaidOut]: { icon: 'gift', tint: '#3E6F6A' },
  [ActivityType.StrategyProposed]: { icon: 'help-circle', tint: '#E0A92E' },
  [ActivityType.StrategyResolved]: { icon: 'checkmark-circle', tint: '#5A8A2C' },
  [ActivityType.Rebalanced]: { icon: 'sync-circle', tint: '#69791A' },
  [ActivityType.GoalCompleted]: { icon: 'trophy', tint: '#5A8A2C' },
  [ActivityType.Defaulted]: { icon: 'alert-circle', tint: '#C8492F' },
  [ActivityType.MemberJoined]: { icon: 'person-add', tint: '#69791A' },
};

function sentence(e: ActivityEvent): string {
  const who = e.actorUsername ?? 'Seseorang';
  switch (e.type) {
    case ActivityType.Contributed:
      return `${who} setor $${e.data.amount} (ronde ${e.data.round})`;
    case ActivityType.StrategyProposed:
      return `${who} usul strategi ${String(e.data.preset).toLowerCase()}`;
    case ActivityType.Rebalanced:
      return `Strategi diubah ke ${String(e.data.preset).toLowerCase()}`;
    case ActivityType.PaidOut:
      return `${who} terima pot`;
    case ActivityType.GoalCompleted:
      return `Tujuan tercapai 🎉`;
    case ActivityType.Defaulted:
      return `${who} keluar — jaminan dipotong`;
    default:
      return `${who}: ${e.type}`;
  }
}

export function ActivityItem({ event }: { event: ActivityEvent }) {
  const m = meta[event.type] ?? { icon: 'ellipse', tint: '#8A8C7C' };
  return (
    <View className="flex-row items-center py-2.5">
      <View
        className="w-9 h-9 rounded-pill items-center justify-center mr-3"
        style={{ backgroundColor: `${m.tint}22` }}
      >
        <Ionicons name={m.icon} size={18} color={m.tint} />
      </View>
      <Text variant="body" className="flex-1">
        {sentence(event)}
      </Text>
    </View>
  );
}
