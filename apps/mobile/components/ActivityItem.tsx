/**
 * One row in the transparent ledger (PRD §12.6). Maps an ActivityEvent to an icon +
 * human, Bahasa-first sentence. No crypto words.
 */
import { View } from 'react-native';
import {
  AlertCircle,
  ArrowDownCircle,
  CheckCircle2,
  Circle,
  Gift,
  HelpCircle,
  RefreshCw,
  Trophy,
  UserPlus,
  type LucideIcon,
} from 'lucide-react-native';
import { ActivityType, type ActivityEvent } from '@lindi/shared';
import { color } from '@lindi/tokens';
import { Text } from './ui/Text';

const meta: Record<string, { icon: LucideIcon; tint: string }> = {
  [ActivityType.Contributed]: { icon: ArrowDownCircle, tint: color.success },
  [ActivityType.PaidOut]: { icon: Gift, tint: color.info },
  [ActivityType.StrategyProposed]: { icon: HelpCircle, tint: color.warning },
  [ActivityType.StrategyResolved]: { icon: CheckCircle2, tint: color.success },
  [ActivityType.Rebalanced]: { icon: RefreshCw, tint: color.lime[800] },
  [ActivityType.GoalCompleted]: { icon: Trophy, tint: color.success },
  [ActivityType.Defaulted]: { icon: AlertCircle, tint: color.danger },
  [ActivityType.MemberJoined]: { icon: UserPlus, tint: color.lime[800] },
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
      return `Tujuan tercapai`;
    case ActivityType.Defaulted:
      return `${who} keluar, jaminan dipotong`;
    default:
      return `${who}: ${e.type}`;
  }
}

export function ActivityItem({ event }: { event: ActivityEvent }) {
  const m = meta[event.type] ?? { icon: Circle, tint: color.ink[400] };
  const Icon = m.icon;
  return (
    <View className="flex-row items-center py-2.5">
      <View
        className="w-9 h-9 rounded-pill items-center justify-center mr-3"
        style={{ backgroundColor: `${m.tint}22` }}
      >
        <Icon size={18} color={m.tint} strokeWidth={2} />
      </View>
      <Text variant="body" className="flex-1">
        {sentence(event)}
      </Text>
    </View>
  );
}
