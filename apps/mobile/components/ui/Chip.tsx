/**
 * Selectable chip (filter / tag). Selected = lime fill + ink text.
 */
import { Pressable } from 'react-native';
import { Text } from './Text';

export function Chip({
  label,
  selected = false,
  onPress,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`rounded-pill px-4 py-2 ${
        selected ? 'bg-lime-500' : 'bg-paper-raised border border-border-hair'
      }`}
    >
      <Text
        variant="caption"
        className={`font-body-strong ${selected ? 'text-ink-900' : 'text-ink-700'}`}
      >
        {label}
      </Text>
    </Pressable>
  );
}
