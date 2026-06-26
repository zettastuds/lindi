/**
 * Section header with optional trailing action (e.g. "Lihat semua").
 */
import { Pressable, View } from 'react-native';
import { Text } from './Text';

export function SectionHeader({
  title,
  actionLabel,
  onAction,
}: {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View className="flex-row items-center justify-between mb-3">
      <Text variant="h2">{title}</Text>
      {actionLabel && (
        <Pressable onPress={onAction}>
          <Text variant="caption" className="text-lime-700 font-body-strong">
            {actionLabel}
          </Text>
        </Pressable>
      )}
    </View>
  );
}
