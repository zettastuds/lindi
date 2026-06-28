/**
 * Empty state, warm and encouraging, never blank (BRAND §7). Uses the sparkle motif.
 * Pass a Lucide component via `icon` (default Sparkles).
 */
import { View } from 'react-native';
import { Sparkles, type LucideIcon } from 'lucide-react-native';
import { color } from '@lindi/tokens';
import { Text } from './Text';
import { Button } from './Button';

export function EmptyState({
  title,
  body,
  actionLabel,
  onAction,
  icon: Icon = Sparkles,
}: {
  title: string;
  body?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: LucideIcon;
}) {
  return (
    <View className="items-center py-10 px-6">
      <View className="w-16 h-16 rounded-pill bg-lime-100 items-center justify-center mb-4">
        <Icon size={28} color={color.lime[700]} strokeWidth={2} />
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
