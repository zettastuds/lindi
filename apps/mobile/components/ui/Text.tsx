/**
 * Typed text primitive. All text in the app goes through this so font family +
 * scale stay consistent (BRAND §5). Never use raw <Text> with ad-hoc styles.
 */
import { Text as RNText, type TextProps } from 'react-native';

type Variant = 'display' | 'h1' | 'h2' | 'body' | 'bodyStrong' | 'caption';

const variantClass: Record<Variant, string> = {
  display: 'font-display text-[32px] leading-[38px] text-ink-900',
  h1: 'font-display text-[24px] leading-[30px] text-ink-900',
  h2: 'font-heading text-[20px] leading-[26px] text-ink-900',
  body: 'font-body text-[16px] leading-[24px] text-ink-900',
  bodyStrong: 'font-body-strong text-[16px] leading-[24px] text-ink-900',
  caption: 'font-caption text-[13px] leading-[18px] text-ink-500',
};

export interface AppTextProps extends TextProps {
  variant?: Variant;
  className?: string;
}

export function Text({ variant = 'body', className = '', ...rest }: AppTextProps) {
  return <RNText className={`${variantClass[variant]} ${className}`} {...rest} />;
}
