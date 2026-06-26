import { View } from 'react-native';

export function Divider({ className = '' }: { className?: string }) {
  return <View className={`h-px bg-border-hair ${className}`} />;
}
