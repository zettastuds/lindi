/**
 * Lindi design tokens — single source of truth.
 * Mirrors docs/BRAND.md. Consumed by the NativeWind config (mobile) and any
 * future web surface. Never hardcode a hex/space/radius in a component — import here.
 *
 * Keep in lockstep with docs/BRAND.md (see CLAUDE.md §2 doc-sync rule).
 */

export const color = {
  paper: {
    base: '#FAF1E0', // app background (warm cream — never pure white)
    raised: '#FFFBF1', // cards, sheets, modals
    sunken: '#F2E7CC', // inputs, wells, pressed surfaces
  },
  border: {
    hair: '#E6DCC4',
  },
  // Brand lime — primary 500 is the cheerful CTA color.
  lime: {
    50: '#FBFDEC',
    100: '#F3FBCB',
    200: '#E7F69D',
    300: '#DBF16E', // approved bright accent / highlight
    400: '#D2EC57',
    500: '#CFE94D', // PRIMARY — buttons, brand
    600: '#B4CE33', // hover / pressed
    700: '#8FA525', // lime text/icon on cream, borders
    800: '#69791A', // deep lime
    brandOg: '#C0CB24', // backup: original logo-accurate lime (not used in UI by default)
  },
  // Warm near-black ink.
  ink: {
    900: '#14150D', // primary text, on-lime foreground
    700: '#33352A', // secondary text, headings
    500: '#5C5E50', // muted text, captions
    400: '#8A8C7C', // placeholders, disabled
  },
  // Semantic — kept OFF brand lime so "money grew" never blends with "tap here".
  success: '#5A8A2C', // positive yield, on-track
  successSoft: '#E8F1D6',
  warning: '#E0A92E',
  danger: '#C8492F', // default/penalty, errors
  dangerSoft: '#F7E2DB',
  info: '#3E6F6A', // neutral / "protected" treasury notes
} as const;

/** Reserved for hero moments only (growing-pot ring, splash, milestone). Not on buttons. */
export const gradient = {
  orb: ['#CFE94D', '#E9F3B0'] as const, // linear 135deg
  hero: ['#DBF16E', '#FAF1E0'] as const, // radial center -> edge
} as const;

/** 4pt base scale. Default screen padding = space[6] (20). */
export const space = [0, 2, 4, 8, 12, 16, 20, 24, 32, 40, 56] as const;

export const radius = {
  sm: 10, // inputs, chips
  md: 16, // cards
  lg: 22, // sheets, hero cards
  pill: 999, // buttons, tags
} as const;

/** Soft, warm, low-opacity shadows — never harsh black. */
export const shadow = {
  card: {
    shadowColor: 'rgba(31,28,15,0.06)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 2,
  },
  raised: {
    shadowColor: 'rgba(31,28,15,0.10)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 6,
  },
} as const;

/** Font family keys map to the loaded @expo-google-fonts names (see apps/mobile). */
export const font = {
  display: 'PlusJakartaSans_700Bold',
  heading: 'PlusJakartaSans_600SemiBold',
  body: 'PlusJakartaSans_400Regular',
  bodyStrong: 'PlusJakartaSans_600SemiBold',
  caption: 'PlusJakartaSans_500Medium',
  potNumber: 'Nunito_800ExtraBold', // the one big growing-pot number
} as const;

/** Type scale: [fontSize, lineHeight]. */
export const typeScale = {
  display: [32, 38],
  potHero: [44, 48],
  h1: [24, 30],
  h2: [20, 26],
  body: [16, 24],
  caption: [13, 18],
} as const;

export type Color = typeof color;
export type Radius = typeof radius;
export type Space = typeof space;
export type Font = typeof font;
