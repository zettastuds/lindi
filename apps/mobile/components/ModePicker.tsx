/**
 * Mode picker for the Create-Circle flow (PRD §12.2). A row of selectable cards,
 * one per CircleMode, each with an icon and a one-line Bahasa description.
 * Token-driven and reusable — reuse, don't fork.
 */
import { Pressable, View } from 'react-native';
import { Users, Target, Globe } from 'lucide-react-native';
import { CircleMode } from '@lindi/shared';
import { color } from '@lindi/tokens';
import { Text } from './ui/Text';

type ModeOption = {
  mode: CircleMode;
  label: string;
  desc: string;
  Icon: typeof Users;
};

const OPTIONS: ModeOption[] = [
  {
    mode: CircleMode.ClassicRotating,
    label: 'Arisan',
    desc: 'Setoran bergilir, dapat giliran tiap ronde.',
    Icon: Users,
  },
  {
    mode: CircleMode.GoalBased,
    label: 'Tujuan',
    desc: 'Menabung bersama untuk satu target.',
    Icon: Target,
  },
  {
    mode: CircleMode.PublicPool,
    label: 'Publik',
    desc: 'Pool terbuka, gabung orang dengan tujuan sama.',
    Icon: Globe,
  },
];

export function ModePicker({
  value,
  onChange,
}: {
  value: CircleMode;
  onChange: (mode: CircleMode) => void;
}) {
  return (
    <View className="gap-2">
      {OPTIONS.map(({ mode, label, desc, Icon }) => {
        const selected = mode === value;
        return (
          <Pressable
            key={mode}
            onPress={() => onChange(mode)}
            accessibilityRole="button"
          >
            <View
              className={`flex-row items-center rounded-md border-[1.5px] p-4 ${
                selected
                  ? 'border-lime-500 bg-lime-50'
                  : 'border-border-hair bg-paper-raised'
              }`}
            >
              <View
                className={`w-10 h-10 rounded-pill items-center justify-center mr-3 ${
                  selected ? 'bg-lime-100' : 'bg-paper-sunken'
                }`}
              >
                <Icon
                  size={20}
                  color={selected ? color.lime[800] : color.ink[700]}
                  strokeWidth={2}
                />
              </View>
              <View className="flex-1">
                <Text variant="bodyStrong">{label}</Text>
                <Text variant="caption" className="mt-0.5">
                  {desc}
                </Text>
              </View>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}
