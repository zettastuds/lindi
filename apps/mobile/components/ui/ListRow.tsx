/**
 * Generic list row: optional leading node, title + subtitle, optional trailing node.
 * Used by member lists, settings, activity, etc.
 */
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from './Text';

export function ListRow({
  title,
  subtitle,
  leading,
  trailing,
  onPress,
  showChevron = false,
}: {
  title: string;
  subtitle?: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  onPress?: () => void;
  showChevron?: boolean;
}) {
  const Wrapper = onPress ? Pressable : View;
  return (
    <Wrapper
      onPress={onPress}
      className="flex-row items-center py-3 active:opacity-70"
    >
      {leading && <View className="mr-3">{leading}</View>}
      <View className="flex-1">
        <Text variant="body">{title}</Text>
        {subtitle && (
          <Text variant="caption" className="mt-0.5">
            {subtitle}
          </Text>
        )}
      </View>
      {trailing}
      {showChevron && (
        <Ionicons name="chevron-forward" size={18} color="#8A8C7C" className="ml-1" />
      )}
    </Wrapper>
  );
}
