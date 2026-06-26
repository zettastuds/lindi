/**
 * Avatar — falls back to the brand orb (lime circle + initial). Sizes sm/md/lg.
 */
import { Image, View } from 'react-native';
import { Text } from './Text';

type Size = 'sm' | 'md' | 'lg';

const sizeClass: Record<Size, string> = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-14 h-14',
};
const textVariant: Record<Size, 'caption' | 'bodyStrong' | 'h2'> = {
  sm: 'caption',
  md: 'bodyStrong',
  lg: 'h2',
};

export function Avatar({
  name,
  uri,
  size = 'md',
}: {
  name: string;
  uri?: string;
  size?: Size;
}) {
  if (uri) {
    return <Image source={{ uri }} className={`${sizeClass[size]} rounded-pill`} />;
  }
  return (
    <View
      className={`${sizeClass[size]} rounded-pill bg-lime-200 items-center justify-center`}
    >
      <Text variant={textVariant[size]} className="text-lime-800">
        {name.slice(0, 1).toUpperCase()}
      </Text>
    </View>
  );
}
