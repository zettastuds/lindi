/**
 * Toggle row (e.g. auto-compound). Label + optional helper + Switch.
 * Lime when on, kept off the success color (which is reserved for money).
 */
import { Switch, View } from 'react-native';
import { Text } from './Text';

export function Toggle({
  label,
  helper,
  value,
  onValueChange,
}: {
  label: string;
  helper?: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
}) {
  return (
    <View className="flex-row items-center justify-between py-1">
      <View className="flex-1 pr-4">
        <Text variant="bodyStrong">{label}</Text>
        {helper && (
          <Text variant="caption" className="mt-0.5">
            {helper}
          </Text>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#E6DCC4', true: '#CFE94D' }}
        thumbColor="#FFFBF1"
        ios_backgroundColor="#E6DCC4"
      />
    </View>
  );
}
