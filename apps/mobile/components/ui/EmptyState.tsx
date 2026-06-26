/**
 * Empty state — warm, encouraging, never blank (BRAND §7). Uses the sparkle motif.
 */
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from './Text';
import { Button } from './Button';

export function EmptyState({
  title,
  body,
  actionLabel,
  onAction,
  icon = 'sparkles',
}: {
  title: string;
  body?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <View className="items-center py-10 px-6">
      <View className="w-16 h-16 rounded-pill bg-lime-100 items-center justify-center mb-4">
        <Ionicons name={icon} size={28} color="#69791A" />
      </View>
      <Text variant="h2" className="text-center">
        {title}
      </Text>
      {body && (
        <Text variant="body" className="text-ink-500 text-center mt-1">
          {body}
        </Text>
      )}
      {actionLabel && (
        <View className="mt-5 w-full">
          <Button label={actionLabel} onPress={onAction} />
        </View>
      )}
    </View>
  );
}
