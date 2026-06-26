# Lindi — Brand & Design System

> The visual + voice source of truth. Derived from the Lindi logo (`images/lindi-logo.png`). Product strategy → `LINDI-PRD.md`. Implementation tokens ship to `packages/tokens` and the NativeWind config (see §11).

| | |
|---|---|
| **Personality** | Warm · optimistic · trustworthy · effortless |
| **Feel target** | **Premium yet approachable** — confident restraint, not cold fintech |
| **Surface** | Mobile-first (Expo React Native + NativeWind) |
| **Last Updated** | June 2026 |

---

## 1. Brand Essence

Lindi protects people's savings while *feeling like the arisan they already trust*. The brand must feel **human and friendly first**, financially **credible underneath** — never intimidating, never "crypto."

**Three adjectives that govern every decision:** *Warm. Clear. Confident.*

| Do | Don't |
|---|---|
| Warm cream paper, soft rounded forms, one cheerful lime accent | Stark white, sharp corners, neon gradients, dark-mode-crypto |
| Plain-language money talk | Jargon (APY-bombing, "DeFi", "wallet", "gas") |
| Big legible numbers, generous space | Dense dashboards, tiny dense tables |
| Calm confidence | Hype, fake urgency, guaranteed-return language |

---

## 2. Logo

The mark = a **lime smiley orb** (gradient sphere with a smile + sparkle) beside the **rounded cursive wordmark "lindi"**.

**Usage**
- **Clear space:** keep at least the height of the orb clear on all sides.
- **Min size:** wordmark legible ≥ 96px wide on screen; below that, use the **orb alone** as app icon / avatar.
- **Backgrounds:** prefer `paper.base` cream. On photos, place on a cream or ink scrim.
- **The cursive wordmark is LOGO-ONLY.** Never set UI text, headings, or body in the script — it's hard to read at size (a known constraint). UI type = Plus Jakarta Sans (§5).

**Don't:** recolor the orb outside the lime ramp · stretch/skew · add drop shadows to the wordmark · place on busy/low-contrast backgrounds · rebuild the wordmark in a different font.

---

## 3. Color

### 3.1 Foundations — Paper (warm, never pure white)
White feels clinical and kills the warmth. Lindi sits on **cream paper**.

| Token | Hex | Use |
|---|---|---|
| `paper.base` | `#FAF1E0` | App background |
| `paper.raised` | `#FFFBF1` | Cards, sheets, modals |
| `paper.sunken` | `#F2E7CC` | Inputs, wells, pressed surfaces |
| `border.hair` | `#E6DCC4` | Hairline dividers, card borders |

### 3.2 Brand — Lime (brightened, cheerful)
Anchored on the logo orb but **lifted in luminance** so it reads joyful, not olive. `lime.500` is the primary brand + CTA color.

| Token | Hex | Use |
|---|---|---|
| `lime.50` | `#FBFDEC` | Faint lime wash / selected row |
| `lime.100` | `#F3FBCB` | Subtle fills, chips |
| `lime.200` | `#E7F69D` | Soft badges |
| `lime.300` | `#DBF16E` | Illustrative fills |
| `lime.400` | `#D2EC57` | Gradient mid |
| **`lime.500`** | **`#CFE94D`** | **PRIMARY — buttons, key accents, brand** |
| `lime.600` | `#B4CE33` | Hover / pressed CTA |
| `lime.700` | `#8FA525` | Lime text/icon on cream, borders |
| `lime.800` | `#69791A` | Deep lime, high-contrast lime text |

**Decision (locked):** Primary = **`lime.500` `#CFE94D`** (cheerful). **`lime.300` `#DBF16E`** is the approved bright accent/highlight (selected favorite — use for glows, selected states, gradient highlight). The original logo-accurate lime **`#C0CB24`** is kept as a documented **backup swatch** (`lime.brand-og`) in case we ever need exact logo-match.

| Token | Hex | Use |
|---|---|---|
| `lime.brand-og` | `#C0CB24` | **Backup** — original logo-accurate lime; not used in UI by default |

> **Foreground on lime:** always **`ink.900`**, never white. Dark-on-lime is high-contrast and cheerful; white-on-lime fails accessibility and looks washed.

### 3.3 Ink (warm near-black)
| Token | Hex | Use |
|---|---|---|
| `ink.900` | `#14150D` | Primary text, on-lime foreground |
| `ink.700` | `#33352A` | Secondary text, headings on cream |
| `ink.500` | `#5C5E50` | Muted text, captions |
| `ink.400` | `#8A8C7C` | Placeholders, disabled |

### 3.4 Semantic — tuned warm, kept OFF brand lime
**Hard rule: success ≠ brand lime.** If "money grew" and "tap here" share a color, the user can't tell value from action. Positive numbers use **moss**, actions use **lime**.

| Token | Hex | Use |
|---|---|---|
| `success` | `#5A8A2C` | Positive yield, "on track", confirmations |
| `success.soft` | `#E8F1D6` | Success backgrounds |
| `warning` | `#E0A92E` | Reminders, attention |
| `danger` | `#C8492F` | Default/penalty, errors, destructive |
| `danger.soft` | `#F7E2DB` | Danger backgrounds |
| `info` | `#3E6F6A` | Neutral info, treasury/"protected" notes |

### 3.5 Gradient (the orb energy)
Use **sparingly** — reserved for hero moments (the growing-pot ring, onboarding splash, milestone celebration). Not on buttons.
```
gradient.orb   linear 135°   #CFE94D → #E9F3B0
gradient.hero  radial        #DBF16E center → #FAF1E0 edge
```

### 3.6 Accessibility
- Body text = `ink.900`/`ink.700` on `paper.*` → all ≥ 7:1 (AAA).
- `ink.900` on `lime.500` ≥ 7:1. ✅ Use for all CTA labels.
- Never rely on color alone for state — pair with icon + label (yield ↑ arrow + moss, not just moss).
- Minimum touch target 44×44pt.

---

## 4. Color Roles (semantic mapping)

| Role | Token |
|---|---|
| Primary action (button bg) | `lime.500` → text `ink.900` |
| Primary action hover/press | `lime.600` |
| Secondary action | outline `ink.900` on `paper.raised` |
| App background | `paper.base` |
| Card | `paper.raised` + `border.hair` |
| Input field | `paper.sunken` |
| Primary text | `ink.900` |
| Muted text | `ink.500` |
| Positive money / yield | `success` |
| Negative / penalty | `danger` |
| "Protected / treasury floor" | `info` |
| Growing-pot hero | `gradient.orb` |

---

## 5. Typography

**Primary family: Plus Jakarta Sans** — designed in Jakarta by Tokotype. Premium geometric-humanist + a literal local-hero story for an Indonesian product. Free (Google Fonts). Load via `expo-font`.

**Optional warmth accent: Nunito** — for the single biggest "growing pot" number, to echo the logo's roundness. Use only there; don't sprinkle.

| Style | Font / Weight | Size / Line | Use |
|---|---|---|---|
| Display | Plus Jakarta Sans 700 | 32 / 38 | Screen titles, hero |
| Pot hero number | Nunito 800 (or PJS 700) | 44 / 48, tabular | The growing balance |
| H1 | Plus Jakarta Sans 700 | 24 / 30 | Section headers |
| H2 | Plus Jakarta Sans 600 | 20 / 26 | Card titles |
| Body | Plus Jakarta Sans 400 | 16 / 24 | Default text |
| Body-strong | Plus Jakarta Sans 600 | 16 / 24 | Emphasis, labels |
| Caption | Plus Jakarta Sans 500 | 13 / 18 | Meta, helper |
| Mono/amount | Plus Jakarta Sans **tabular figures** | — | Money, must column-align |

**Rules**
- Numbers that change (pot, yield, projections) use **tabular figures** so digits don't jitter.
- One display weight per screen — don't stack many bold sizes.
- Bahasa Indonesia first; English toggle. Keep line lengths comfortable for ID phrasing (often longer).

---

## 6. Spacing, Radius, Elevation

**Spacing scale (4pt base):** `2 · 4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 56`. Default screen padding **20**. Card padding **16–20**.

**Radius (rounded = friendly):**
| Token | px | Use |
|---|---|---|
| `radius.sm` | 10 | inputs, chips |
| `radius.md` | 16 | cards |
| `radius.lg` | 22 | sheets, hero cards |
| `radius.pill` | 999 | buttons, tags |

> Buttons are **pill-shaped** — it mirrors the orb's roundness and reads approachable.

**Elevation — soft, warm, low.** No harsh black shadows.
```
shadow.card   y2  blur 12  color rgba(31,28,15,0.06)
shadow.raised y6  blur 24  color rgba(31,28,15,0.10)
```
Premium feel comes from **soft shadow + generous padding + cream paper**, not heavy borders.

---

## 7. Iconography & Illustration

- **Icons:** rounded, 2px stroke, friendly (Phosphor "regular/bold" or Lucide rounded). Match the logo's soft geometry.
- **The orb + sparkle** is the brand motif — reuse the sparkle for "your money grew / milestone" moments.
- **Illustration:** simple, warm, human (people saving together, not coins/charts). Avoid generic crypto/3D-coin art entirely.
- **Empty states:** use the smiley orb personality — warm, encouraging, never blank.

---

## 8. Motion

Premium = **calm, purposeful** motion. (Use `react-native-reanimated`; see the `page-load-animations` skill for production recipes.)

- **Growing-pot number:** smoothly rolls/ticks up (the signature interaction — money visibly alive).
- **Page entrance:** gentle staggered fade-up (60–80ms stagger), spring, not linear.
- **Milestone:** sparkle burst from the orb + soft scale pop.
- **Durations:** 200–320ms; springs over ease for the friendly bounce.
- **Restraint:** one hero motion per screen. No motion on dense lists beyond a subtle stagger.

---

## 9. Voice & Tone

**Warm, plain, honest.** Talk like a trusted friend who's good with money — not a bank, not a crypto bro.

| Principle | Yes | No |
|---|---|---|
| Plain language | "Your group's savings grew Rp42.000 this month" | "Yield accrued: +0.34% APY" |
| Honest about risk | "Targets ~5–6% — varies, with a protected floor" | "Guaranteed 6%!" |
| No crypto words | "secured", "your savings" | "wallet", "gas", "on-chain", "token" |
| Encouraging | "4 months to Umroh — you're on track" | "Goal incomplete" |
| Calm | "Bu Sri hasn't paid this round yet" | "⚠️ MEMBER DEFAULT" |

Bilingual: **Bahasa Indonesia is primary**, English is the toggle. Keep the honesty model (PRD §9.4) in every yield string — never print a guaranteed number for a variable preset.

---

## 10. Component Direction (RN + react-native-reusables + NativeWind)

| Component | Direction |
|---|---|
| **Button (primary)** | pill, `lime.500` bg, `ink.900` label 600, `lime.600` pressed |
| **Button (secondary)** | pill, `paper.raised`, `ink.900` 1.5px border |
| **Card** | `paper.raised`, `radius.md`, `shadow.card`, 16–20 pad |
| **Growing-pot hero** | large card, `gradient.orb` ring, Nunito number, ticking animation |
| **Input** | `paper.sunken`, `radius.sm`, `ink.900` text, lime focus ring |
| **Chip/tag** | pill, `lime.100` bg / `lime.800` text (or semantic soft) |
| **Member row** | avatar (orb fallback), username, paid-status dot (moss/amber) |
| **Preset selector** | 3 cards (Conservative/Balanced/Growth), live APY range, floor line distinct |
| **Bottom sheet** | `radius.lg`, drag handle, `paper.raised` |

Shared **tokens** drive all of it (`packages/tokens`). Components live in `apps/mobile` (or `packages/ui` if a second RN surface appears).

---

## 11. Tokens in Code

Single source: `packages/tokens/src/index.ts` (consumed by NativeWind config + any future web).

```ts
// packages/tokens/src/index.ts
export const color = {
  paper:  { base:'#FAF1E0', raised:'#FFFBF1', sunken:'#F2E7CC' },
  border: { hair:'#E6DCC4' },
  lime: { 50:'#FBFDEC',100:'#F3FBCB',200:'#E7F69D',300:'#DBF16E',
          400:'#D2EC57',500:'#CFE94D',600:'#B4CE33',700:'#8FA525',800:'#69791A',
          'brandOg':'#C0CB24' /* backup: original logo lime */ },
  ink:  { 900:'#14150D',700:'#33352A',500:'#5C5E50',400:'#8A8C7C' },
  success:'#5A8A2C', successSoft:'#E8F1D6',
  warning:'#E0A92E',
  danger:'#C8492F',  dangerSoft:'#F7E2DB',
  info:'#3E6F6A',
} as const;

export const radius = { sm:10, md:16, lg:22, pill:999 } as const;
export const space  = [0,2,4,8,12,16,20,24,32,40,56] as const;
export const font = {
  display:'PlusJakartaSans_700Bold',
  heading:'PlusJakartaSans_600SemiBold',
  body:'PlusJakartaSans_400Regular',
  bodyStrong:'PlusJakartaSans_600SemiBold',
  potNumber:'Nunito_800ExtraBold',
} as const;
```

```js
// apps/mobile/tailwind.config.js  (NativeWind)
const { color, radius } = require('@lindi/tokens');
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: { extend: {
    colors: {
      paper: color.paper, border: color.border,
      lime: color.lime, ink: color.ink,
      success: color.success, warning: color.warning,
      danger: color.danger, info: color.info,
    },
    borderRadius: { sm:`${radius.sm}px`, md:`${radius.md}px`, lg:`${radius.lg}px`, pill:'999px' },
  }},
};
```

---

## 12. Quick Reference Card

```
PRIMARY      lime.500  #CFE94D   (text on it = ink.900)
PAPER        #FAF1E0   CARD #FFFBF1   INPUT #F2E7CC
TEXT         ink.900 #14150D / ink.500 #5C5E50
YIELD UP     success #5A8A2C   (NOT lime)
PENALTY/ERR  danger  #C8492F
TYPE         Plus Jakarta Sans (+ Nunito for the pot number)
SHAPE        pill buttons · 16px cards · soft warm shadows
MOTION       ticking pot number · gentle fade-up · sparkle on milestone
VOICE        warm · plain · honest · Bahasa-first · no crypto words
```

> When in doubt: warmer, rounder, simpler, more honest.
