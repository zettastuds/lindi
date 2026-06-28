/**
 * A human chat message (PRD §12.9). Mine = lime right bubble; others = paper left
 * bubble with avatar + username. Text-kind messages only.
 */
import { View } from 'react-native';
import type { Message } from '@lindi/shared';
import { Avatar } from '../ui/Avatar';
import { Text } from '../ui/Text';

export function ChatBubble({ message, mine }: { message: Message; mine: boolean }) {
  if (mine) {
    return (
      <View className="items-end mb-2">
        <View className="bg-lime-500 rounded-lg rounded-tr-sm px-3.5 py-2.5 max-w-[80%]">
          <Text variant="body" className="text-ink-900">
            {message.body}
          </Text>
        </View>
      </View>
    );
  }
  return (
    <View className="flex-row items-end gap-2 mb-2">
      <Avatar name={message.authorUsername} size="sm" />
      <View className="max-w-[78%]">
        <Text variant="caption" className="text-ink-500 ml-1 mb-0.5">
          {message.authorUsername}
        </Text>
        <View className="bg-paper-raised border border-border-hair rounded-lg rounded-tl-sm px-3.5 py-2.5">
          <Text variant="body" className="text-ink-900">
            {message.body}
          </Text>
        </View>
      </View>
    </View>
  );
}
