/**
 * Card surface (BRAND §6): paper.raised, radius.md, soft warm shadow.
 */
import { View, type ViewProps } from 'react-native';
import { shadow } from '@lindi/tokens';

export interface CardProps extends ViewProps {
  className?: string;
  elevated?: boolean;
}

export function Card({ className = '', elevated = false, style, ...rest }: CardProps) {
  return (
    <View
      className={`bg-paper-raised rounded-md border border-border-hair p-5 ${className}`}
      style={[elevated ? shadow.raised : shadow.card, style]}
      {...rest}
    />
  );
}
