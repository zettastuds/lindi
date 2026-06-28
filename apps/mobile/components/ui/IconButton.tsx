/**
 * Icon button using Lucide icons. Circular, paper or lime surface.
 * Pass a Lucide component via `icon` (e.g. icon={Bell}) — never a string name.
 */
import { Pressable, type PressableProps } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { color } from '@lindi/tokens';

type Variant = 'soft' | 'lime' | 'ghost';
const variantClass: Record<Variant, string> = {
  soft: 'bg-paper-raised border border-border-hair active:bg-paper-sunken',
  lime: 'bg-lime-500 active:bg-lime-600',
  ghost: 'bg-transparent active:bg-paper-sunken',
};

export interface IconButtonProps extends Omit<PressableProps, 'children'> {
  icon: LucideIcon;
  variant?: Variant;
  size?: number;
  className?: string;
}

export function IconButton({
  icon: Icon,
  variant = 'soft',
  size = 20,
  className = '',
  ...rest
}: IconButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      className={`w-11 h-11 rounded-pill items-center justify-center ${variantClass[variant]} ${className}`}
      {...rest}
    >
      <Icon size={size} color={color.ink[900]} strokeWidth={2} />
    </Pressable>
  );
}
