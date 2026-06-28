/**
 * Inline strategy-vote card inside the chat thread (PRD §12.9 / §8.3). Lets members
 * vote in place; ties group governance to the social surface. `meta.voteId` links the
 * StrategyVote. Approve/reject are wired by the caller (mock no-op for now).
 */
import { View, Pressable } from 'react-native';
import { GitBranch } from 'lucide-react-native';
import type { Message } from '@lindi/shared';
import { color } from '@lindi/tokens';
import { Text } from '../ui/Text';

export function VotePromptCard({
  message,
  onApprove,
  onReject,
}: {
  message: Message;
  onApprove?: () => void;
  onReject?: () => void;
}) {
  return (
    <View className="my-2 bg-paper-raised border border-lime-500 rounded-md p-3.5">
      <View className="flex-row items-center gap-2 mb-1">
        <GitBranch size={16} color={color.lime[700]} strokeWidth={2} />
        <Text variant="caption" className="text-lime-700 font-body-strong">
          VOTING STRATEGI
        </Text>
      </View>
      <Text variant="body" className="text-ink-900 mb-2">
        {message.body}
      </Text>
      <View className="flex-row gap-2">
        <Pressable
          onPress={onApprove}
          className="flex-1 bg-lime-500 active:bg-lime-600 rounded-pill h-9 items-center justify-center"
        >
          <Text variant="bodyStrong" className="text-ink-900">
            Setuju
          </Text>
        </Pressable>
        <Pressable
          onPress={onReject}
          className="flex-1 bg-paper-sunken active:opacity-70 rounded-pill h-9 items-center justify-center"
        >
          <Text variant="bodyStrong" className="text-ink-700">
            Tolak
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
