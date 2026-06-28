/**
 * Generic list row: optional leading node, title + subtitle, optional trailing node.
 * Used by member lists, settings, activity, etc.
 */
import { Pressable, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { color } from '@lindi/tokens';
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
        <View className="ml-1">
          <ChevronRight size={18} color={color.ink[400]} strokeWidth={2} />
        </View>
      )}
    </Wrapper>
  );
}
