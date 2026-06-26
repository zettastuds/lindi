/**
 * Icon button using @expo/vector-icons (Ionicons). Circular, paper or lime surface.
 */
import { Ionicons } from '@expo/vector-icons';
import { Pressable, type PressableProps } from 'react-native';

type Variant = 'soft' | 'lime' | 'ghost';
const variantClass: Record<Variant, string> = {
  soft: 'bg-paper-raised border border-border-hair active:bg-paper-sunken',
  lime: 'bg-lime-500 active:bg-lime-600',
  ghost: 'bg-transparent active:bg-paper-sunken',
};

export interface IconButtonProps extends Omit<PressableProps, 'children'> {
  name: keyof typeof Ionicons.glyphMap;
  variant?: Variant;
  size?: number;
}

export function IconButton({
  name,
  variant = 'soft',
  size = 20,
  className = '',
  ...rest
}: IconButtonProps & { className?: string }) {
  return (
    <Pressable
      accessibilityRole="button"
      className={`w-11 h-11 rounded-pill items-center justify-center ${variantClass[variant]} ${className}`}
      {...rest}
    >
      <Ionicons name={name} size={size} color="#14150D" />
    </Pressable>
  );
}
