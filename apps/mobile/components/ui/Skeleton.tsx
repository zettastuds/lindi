/**
 * Loading skeleton with a gentle pulse (reanimated). Use for list/card placeholders.
 */
import { useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

export function Skeleton({
  className = '',
  height = 16,
  radius = 8,
}: {
  className?: string;
  height?: number;
  radius?: number;
}) {
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 800 }), -1, true);
  }, [opacity]);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      className={`bg-paper-sunken ${className}`}
      style={[{ height, borderRadius: radius }, style]}
    />
  );
}
