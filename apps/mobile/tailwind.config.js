// NativeWind theme — driven entirely by @lindi/tokens (single source of truth).
// No raw hex/spacing here beyond what the tokens export. See docs/BRAND.md §11.
const { color, radius, font } = require('@lindi/tokens');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        paper: color.paper,
        border: { hair: color.border.hair },
        lime: color.lime,
        ink: color.ink,
        success: color.success,
        'success-soft': color.successSoft,
        warning: color.warning,
        danger: color.danger,
        'danger-soft': color.dangerSoft,
        info: color.info,
      },
      borderRadius: {
        sm: `${radius.sm}px`,
        md: `${radius.md}px`,
        lg: `${radius.lg}px`,
        pill: '999px',
      },
      fontFamily: {
        display: [font.display],
        heading: [font.heading],
        body: [font.body],
        'body-strong': [font.bodyStrong],
        caption: [font.caption],
        pot: [font.potNumber],
      },
    },
  },
  plugins: [],
};
