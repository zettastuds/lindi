/**
 * Text input (BRAND §6): paper.sunken fill, lime focus ring, optional label + helper.
 * Supports prefix (e.g. "$") and error state.
 */
import { useState } from 'react';
import { TextInput, View, type TextInputProps } from 'react-native';
import { Text } from './Text';

export interface InputProps extends TextInputProps {
  label?: string;
  helper?: string;
  error?: string;
  prefix?: string;
  leftIcon?: React.ReactNode; // e.g. a Lucide <Search /> node
  className?: string;
}

export function Input({
  label,
  helper,
  error,
  prefix,
  leftIcon,
  className = '',
  ...rest
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const ring = error
    ? 'border-danger'
    : focused
      ? 'border-lime-500'
      : 'border-border-hair';

  return (
    <View className={className}>
      {label && (
        <Text variant="caption" className="mb-1.5 text-ink-700 font-body-strong">
          {label}
        </Text>
      )}
      <View
        className={`flex-row items-center bg-paper-sunken rounded-sm border-[1.5px] px-4 h-12 ${ring}`}
      >
        {leftIcon && <View className="mr-2">{leftIcon}</View>}
        {prefix && (
          <Text variant="body" className="text-ink-500 mr-1">
            {prefix}
          </Text>
        )}
        <TextInput
          className="flex-1 font-body text-[16px] text-ink-900 h-full"
          placeholderTextColor="#8A8C7C"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...rest}
        />
      </View>
      {(helper || error) && (
        <Text
          variant="caption"
          className={`mt-1 ${error ? 'text-danger' : 'text-ink-500'}`}
        >
          {error ?? helper}
        </Text>
      )}
    </View>
  );
}
