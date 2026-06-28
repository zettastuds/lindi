# Lindi — Project Guide for Claude

Lindi = group savings platform on Stellar. Arisan (rotating savings) + USD-protected yield, invisible crypto. APAC Stellar Hackathon 2026 (testnet MVP). Hero market: Indonesia.

**The PRD is the bible.** `docs/LINDI-PRD.md` is the source of truth for *what* and *why*. If reality diverges from it, **update the PRD** — never let code and PRD drift silently.

---

## 1. Documentation Map

Every doc has one job. Read the relevant one before working in its domain.

| Doc | Owns | Read it when |
|---|---|---|
| `docs/LINDI-PRD.md` | **Product bible** — vision, market, mechanics, scope, business model, demo. The *what/why*. | Any product/scope/feature decision |
| `docs/SPRINT-PLAN.md` | **Execution plan** — 2-person parallel tracks (Dylan FE / Ifal BC), sprint goals/deliverables, mock-seam handshake, demo checkpoints. | Planning, who-does-what, sequencing |
| `docs/BRAND.md` | Design system — color tokens, type, spacing, motion, voice, components. | Any UI / styling / copy work |
| `docs/technical/ARCHITECTURE.md` | System layers, custody/trust boundaries, request lifecycle, env matrix. | System design, data flow, infra |
| `docs/technical/SMART-CONTRACTS.md` | Lindi Core Soroban contract — storage, functions, vault-as-circle, governance, default/penalty, tests. | Any Rust/contract work |
| `docs/technical/INTEGRATIONS.md` | Third parties — DeFindex, OZ Relayer+Channels, smart-account-kit, OZ stellar-contracts, Soroswap, Reflector. | Any SDK/integration work |
| `docs/technical/YIELD-ENGINE.md` | Preset→strategy allocation, live-APY pipeline, projection/calculator math, penalty curve, honesty rules. | Yield, calculator, presets |
| `docs/technical/DATA-MODEL.md` | ERD + all entities (on-chain + off-chain), share-mapping invariants, mock-data→real-data mapping. | Data, DB, mock data, types |

---

## 2. Doc Maintenance Rule (keep docs in sync)

**Whenever you change something in `docs/`, propagate it.** Docs are a connected set, not islands.

1. **PRD is upstream.** A product/scope/mechanic change starts in `LINDI-PRD.md`, then cascades to the affected technical doc(s).
2. **A technical change that contradicts the PRD** → update the PRD too (or flag the conflict explicitly; never leave them disagreeing).
3. **Cross-references:** if you rename/move a section, fix every `§`/path reference pointing to it across all docs.
4. **Decisions Log:** new locked decisions go in `LINDI-PRD.md` §22.1 (Dxx) and, if technical, the relevant tech doc's open-questions section.
5. **Data shape changes** (`DATA-MODEL.md`) must stay in lockstep with `packages/shared` types and any mock data — see §4.
6. **Brand changes** (`BRAND.md` tokens) must stay in lockstep with `packages/tokens` and the NativeWind config.

After any docs edit, do a quick scan: "what else now references this?" and update it in the same change. State what you synced.

> True file-watch automation needs a harness hook (Claude can't self-trigger on file save). If you want a hook that reminds on every `docs/` save, ask and I'll set one up via the `update-config` skill. Until then, this rule is the mechanism — follow it on every docs edit.

---

## 3. Component Rule (shared-first)

**Always reuse a shared component. Only create a new one if reuse is genuinely impossible.**

Order of preference, every time you need UI:
1. **Reuse** an existing shared component (`packages/ui` if present, else `apps/mobile/components`). Extend via props.
2. **Adapt** — if it almost fits, add a variant/prop to the shared component rather than forking it.
3. **Create new** — only if it's a genuinely new primitive. Put it in the shared location (not inline in a screen) so the next use reuses it. Build it from design tokens (`packages/tokens` / `BRAND.md`), never hardcoded hex/spacing.

Rules:
- **No hardcoded colors, spacing, radii, fonts.** Pull from tokens. A raw `#hex` in a component is a bug.
- A new component must be token-driven, typed, and placed where it can be shared.
- If you find two near-duplicate components, consolidate into one with variants.
- Tokens are shared everywhere; RN components are shared within mobile (RN ≠ web DOM — can't share with a web app unless `react-native-web`).

---

## 4. Mock Data ↔ Real Data

Frontend scaffolds against **mock data shaped exactly like `DATA-MODEL.md`** so swapping to real data is a data-source change, not a refactor.

- Types live in `packages/shared` and **match `DATA-MODEL.md` 1:1**.
- Mock fixtures implement those types. Real API/chain reads return the same types.
- If a screen needs a field the data model lacks → add it to `DATA-MODEL.md` + `packages/shared` first, then use it. Never invent ad-hoc shapes in a component.

---

## 5. Tech Stack (locked)

| Layer | Choice |
|---|---|
| Monorepo | Turborepo + pnpm workspaces |
| Mobile | Expo React Native + NativeWind (Tailwind) + react-native-reusables + reanimated |
| Backend | NestJS on Node, TypeScript |
| Shared | `packages/{shared,stellar,tokens,config}` |
| Contracts | Soroban (Rust) in `contracts/` (own cargo toolchain) |
| Yield | DeFindex (`@defindex/sdk`) — sole yield integration |
| Auth | smart-account-kit + OZ `stellar-contracts` (P256 passkeys) |
| Gas | OpenZeppelin Relayer + relayer-plugin-channels |
| Fonts | Plus Jakarta Sans (+ Nunito for the pot number) |

Language is TypeScript end-to-end (mobile + backend + shared) on purpose — the Stellar SDKs are TS-first; reuse types and SDK wrappers across the stack.

---

## 6. Working Conventions

- **Honesty model is inviolable** (PRD §9.4): never render a guaranteed % for a variable preset; variable presets render as ranges. Enforce in code, not just copy.
- **No crypto words in user-facing copy** (PRD / BRAND §9): "savings", "secured" — not "wallet", "gas", "token", "on-chain".
- **Custody boundary** (ARCHITECTURE §3): backend never holds keys to user funds; vault manager = the Lindi Core contract (contract-as-manager), not an off-chain key.
- **Test the default + penalty paths** — judges probe them; invariants `penalty ≤ yield` and `Σ member.shares == pot.vault_shares_total`.
- **Scope discipline** (PRD §14.4): a working simple version beats a broken ambitious one. Respect the scope-cut order.
- Bahasa Indonesia first, English toggle.
- Commit/PR style only when asked; end commit messages with the Co-Authored-By line.

### 6.1 UI / Icon / Copy Rules (inviolable)

- **No emoji / emoticons anywhere in the app UI or in mock copy.** Use **Lucide** icons (`lucide-react-native`) instead. A 🎉/🙏/👍/🔍 in a screen, component, or fixture string is a bug. Icons render through Lucide components (premium, consistent stroke), driven by token colors.
  - `IconButton` takes a Lucide component via the `icon` prop (not a string name). `EmptyState`, etc. follow the same pattern. Import the specific icon: `import { Bell } from 'lucide-react-native'`.
  - We standardized on Lucide; do **not** add new `@expo/vector-icons`/Ionicons usages.
- **No em-dashes ( — ) in any text shown on screen** (UI strings, mock copy, labels, headlines, chat/message bodies). Use a comma, a period, or restructure. Em-dashes in **source code comments / docs are fine** (they don't render). When in doubt: if a user could read it in the running app, no em-dash.
- **Brand assets:** source SVGs live in `packages/assets/brand/` (turborepo source of truth); the app consumes the high-res PNG exports in `apps/mobile/assets/brand/` (`logo.png` = wordmark, `symbol.png` = orb mark) via the `Logo` component. The original `images/` SVGs are embedded-PNG, not clean vectors, so we use the extracted PNGs.

---

## 7. Self-Learning Log

A living log of durable, project-specific truth. **Both Claude and the human append here.**

- **Claude:** when you discover something non-obvious that will matter later (an SDK quirk, a working testnet address, a build/tooling fix, a reversed decision + why), add an entry — proactively, without being asked.
- **Human:** drop a line anytime; same format. Claude reads this section before re-deriving anything that feels familiar.

**Format:** `- [YYYY-MM-DD] <learning> — <why it matters / how to apply>`
**Include:** integration gotchas, confirmed facts, decisions + reasons, time-wasters avoided.
**Exclude:** anything already in the docs, generic knowledge, one-off conversation context. Prune stale/incorrect entries.

> Cross-link bigger facts to the memory system at `~/.claude/projects/.../memory/` when appropriate; this log is the fast in-repo scratch of project truth.

### Entries
- [2026-06-26] Mobile = Expo SDK 54 (RN 0.81.5, React 19.1, expo-router 6, NativeWind 4.2, reanimated 4.1.7). Reanimated 4 uses **`react-native-worklets/plugin`** in babel (last plugin) + the `react-native-worklets` dep — NOT the old `react-native-reanimated/plugin`. — Wrong plugin = silent worklet crashes.
- [2026-06-26] NativeWind 4 + pnpm: Metro fails with `Unable to resolve react-native-css-interop/jsx-runtime` because babel rewrites JSX to import it from app scope. Fix: add `react-native-css-interop` as an explicit app dep + `public-hoist-pattern[]=*react-native-css-interop*` in `.npmrc`. — After any SDK bump, **delete node_modules + lockfile + .expo and reinstall**, then `expo start -c`; in-place upgrades leave stale peer-locked graphs (old RN/reanimated islands).
- [2026-06-26] Web blank screen = missing `react-dom` + `react-native-web` + `@expo/metro-runtime`. Always add all three for Expo web. pnpm hoisted layout puts deps in `apps/mobile/node_modules`, not root — don't panic if root looks empty.
- [2026-06-26] Lime primary = `#CFE94D`, accent `#DBF16E`, backup `#C0CB24` (original logo). — Use the bright one in UI; logo-og only if exact match needed.
- [2026-06-26] USTRY/treasury yield is available *inside* DeFindex (Etherfuse strategy), not a separate integration. CETES (MX) + TESOURO (BR) too. — One DeFindex integration covers the whole yield stack + multi-currency floor story.
- [2026-06-26] Soroswap "Earn" = DeFindex under the hood; Soroswap AMM LP yield isn't a DeFindex strategy. — Keep Soroswap swap-only; no yield from it.
- [2026-06-26] All core SDKs (stellar-sdk, smart-account-kit, defindex-sdk) are TypeScript. — Drove the RN + Node/TS monorepo decision; reuse types across stack.
- [2026-06-29] Icons standardized on **lucide-react-native** (v1.21.0 — real package, homepage lucide.dev; needs `react-native-svg ^15`, which we added). `IconButton`/`EmptyState` take a Lucide **component** via the `icon` prop, not a string name. No `@expo/vector-icons`/Ionicons. Emoji banned in UI (see §6.1). — Premium, consistent icon set.
- [2026-06-29] **typedRoutes DISABLED** (`app.json` experiments.typedRoutes=false) + deleted stale `.expo/types/router.d.ts`. Restructuring routes (moved Home/Discover into an `app/(tabs)/` group with a custom tab bar) kept tripping tsc on the **stale generated route types** — tsc reads `router.d.ts` but only `expo start`/`export` regenerates it, and Metro can't boot in this sandbox. Hrefs are plain strings now. Re-enable by flipping the flag + running expo once to regen types after routes stabilize. — Avoids false route-typing errors during rapid screen work.
- [2026-06-29] Brand logos in old `images/` were **embedded-PNG-inside-SVG** (a `<pattern>` wrapping base64), not vectors. Extracted the base64 → `apps/mobile/assets/brand/{logo,symbol}.png` (500x500, transparent); SVG source moved to `packages/assets/brand/`. The `Logo` component renders the PNG. — Don't wire svg-transformer for these; they're raster. Use `<Logo variant="wordmark|symbol" />`.
- [2026-06-29] Dev machine is WSL2 (IP `172.17.4.103`). Metro binds to that IP; QR code encodes it; phone on WiFi can't reach it → Expo Go shows "loading" forever. Web works because browser is on the same machine. Fix: `pnpm mobile:tunnel` (uses ngrok via `@expo/ngrok`). Alternative: Windows port-proxy — in PowerShell Admin: `netsh interface portproxy add v4tov4 listenport=8081 listenaddress=0.0.0.0 connectport=8081 connectaddress=172.17.4.103` + firewall rule, then `REACT_NATIVE_PACKAGER_HOSTNAME=<windows-lan-ip> expo start`.
