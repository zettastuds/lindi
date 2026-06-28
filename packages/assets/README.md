# @lindi/assets

Brand assets, source of truth for Lindi imagery. Restructured here from the old
top-level `images/` folder to match the Turborepo `packages/*` layout.

## brand/

| File | What |
|---|---|
| `logo.svg` | Full wordmark ("lindi" + orb mark). |
| `symbol.svg` | The orb mark alone. |

### Why the app uses PNGs, not these SVGs

The source SVGs are **embedded-PNG-in-SVG** (a `<pattern>` wrapping a base64 raster),
not clean vector paths. So the mobile app does **not** import these SVGs directly.
Instead, the high-res (500x500, transparent) PNG exports live in
`apps/mobile/assets/brand/` (`logo.png`, `symbol.png`) and are rendered through the
`Logo` component (`apps/mobile/components/ui/Logo.tsx`):

```tsx
import { Logo } from '@/components/ui';
<Logo variant="wordmark" height={28} />  // or variant="symbol"
```

If a true vector logo is produced later, drop it here and switch `Logo` to
`react-native-svg` + `react-native-svg-transformer`.
