/**
 * System-generated feed entries (PRD §12.9), woven into the chat thread:
 * - kind "system"    : a quiet centered projection of an on-chain activity event
 * - kind "milestone" : a celebratory centered chip (goal progress, first yield)
 * These are projections of chain state, not human messages.
 */
import { View } from 'react-native';
import type { Message } from '@lindi/shared';
import { Text } from '../ui/Text';

export function SystemEvent({ message }: { message: Message }) {
  if (message.kind === 'milestone') {
    return (
      <View className="items-center my-3">
        <View className="bg-lime-200 rounded-pill px-4 py-2">
          <Text variant="bodyStrong" className="text-ink-900 text-center">
            {message.body}
          </Text>
        </View>
      </View>
    );
  }
  return (
    <View className="flex-row items-center justify-center gap-1.5 my-2">
      <View className="w-1 h-1 rounded-pill bg-ink-400" />
      <Text variant="caption" className="text-ink-500 text-center">
        {message.body}
      </Text>
    </View>
  );
}
