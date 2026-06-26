/**
 * Pill button (BRAND §10). Primary = lime.500 bg + ink.900 label (never white on lime).
 * Variants: primary | secondary | ghost. Add new variants here — don't fork.
 */
import { ActivityIndicator, Pressable, type PressableProps, View } from 'react-native';
import { Text } from './Text';

type Variant = 'primary' | 'secondary' | 'ghost';

const base = 'rounded-pill px-6 h-12 items-center justify-center flex-row';
const variantClass: Record<Variant, string> = {
  primary: 'bg-lime-500 active:bg-lime-600',
  secondary: 'bg-paper-raised border-[1.5px] border-ink-900 active:bg-paper-sunken',
  ghost: 'bg-transparent active:bg-paper-sunken',
};
const labelClass: Record<Variant, string> = {
  primary: 'text-ink-900',
  secondary: 'text-ink-900',
  ghost: 'text-ink-700',
};

export interface ButtonProps extends Omit<PressableProps, 'children'> {
  label: string;
  variant?: Variant;
  loading?: boolean;
  className?: string;
}

export function Button({
  label,
  variant = 'primary',
  loading = false,
  disabled,
  className = '',
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      className={`${base} ${variantClass[variant]} ${isDisabled ? 'opacity-50' : ''} ${className}`}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color="#14150D" />
      ) : (
        <View className="flex-row items-center gap-2">
          <Text variant="bodyStrong" className={labelClass[variant]}>
            {label}
          </Text>
        </View>
      )}
    </Pressable>
  );
}
