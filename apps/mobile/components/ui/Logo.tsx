/**
 * Brand mark. `wordmark` = full "lindi" logo + orb; `symbol` = the orb alone.
 * Source SVGs live in packages/assets/brand; we render the high-res PNG exports
 * (the source SVGs are embedded-PNG, not clean vectors). Token-driven sizing.
 */
import { Image } from 'react-native';

const ASSETS = {
  wordmark: require('../../assets/brand/logo.png'),
  symbol: require('../../assets/brand/symbol.png'),
} as const;

// Intrinsic aspect ratios of the exported canvases (both 500x500 with padding).
const ASPECT = { wordmark: 1, symbol: 1 } as const;

export function Logo({
  variant = 'wordmark',
  height = 40,
}: {
  variant?: keyof typeof ASSETS;
  height?: number;
}) {
  return (
    <Image
      source={ASSETS[variant]}
      style={{ height, width: height / ASPECT[variant] }}
      resizeMode="contain"
      accessibilityRole="image"
      accessibilityLabel="Lindi"
    />
  );
}
