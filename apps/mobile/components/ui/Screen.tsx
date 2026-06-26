/**
 * Screen wrapper: cream background + safe area + default padding (BRAND §6).
 */
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export interface ScreenProps {
  children: React.ReactNode;
  scroll?: boolean;
  className?: string;
}

export function Screen({ children, scroll = true, className = '' }: ScreenProps) {
  const Inner = scroll ? ScrollView : View;
  return (
    <SafeAreaView className="flex-1 bg-paper-base" edges={['top']}>
      <Inner
        className={`flex-1 px-5 ${className}`}
        contentContainerClassName={scroll ? 'pb-10 pt-2' : undefined}
      >
        {children}
      </Inner>
    </SafeAreaView>
  );
}
