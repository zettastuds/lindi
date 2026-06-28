/**
 * Interest/goal tag pill for the Discover feed (PRD §8.7 / §12.8). Selectable variant
 * for filter rows. Token-driven; reuse — don't fork.
 */
import { Pressable } from 'react-native';
import { Text } from './Text';

export interface TagChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  className?: string;
}

export function TagChip({ label, selected = false, onPress, className = '' }: TagChipProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      className={`rounded-pill px-3 h-8 items-center justify-center border ${
        selected
          ? 'bg-ink-900 border-ink-900'
          : 'bg-paper-raised border-border-hair active:bg-paper-sunken'
      } ${className}`}
    >
      <Text variant="caption" className={selected ? 'text-paper-base' : 'text-ink-700'}>
        {label}
      </Text>
    </Pressable>
  );
}
