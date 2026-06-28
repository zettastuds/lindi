# Lindi — Project Guide for Claude

Lindi = group savings platform on Stellar. Arisan (rotating savings) + USD-protected yield, invisible crypto. APAC Stellar Hackathon 2026 (testnet MVP). Hero market: Indonesia.

**The PRD is the bible.** `docs/LINDI-PRD.md` is the source of truth for *what* and *why*. If reality diverges from it, **update the PRD** — never let code and PRD drift silently.

---

## 1. Documentation Map

Every doc has one job. Read the relevant one before working in its domain.

| Doc | Owns | Read it when |
|---|---|---|
| `docs/LINDI-PRD.md` | **Product bible** — vision, market, mechanics, scope, business model, demo. The *what/why*. | Any product/scope/feature decision |
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
- [2026-06-29] Dev machine is WSL2 (IP `172.17.4.103`). Metro binds to that IP; QR code encodes it; phone on WiFi can't reach it → Expo Go shows "loading" forever. Web works because browser is on the same machine. Fix: `pnpm mobile:tunnel` (uses ngrok via `@expo/ngrok`). Alternative: Windows port-proxy — in PowerShell Admin: `netsh interface portproxy add v4tov4 listenport=8081 listenaddress=0.0.0.0 connectport=8081 connectaddress=172.17.4.103` + firewall rule, then `REACT_NATIVE_PACKAGER_HOSTNAME=<windows-lan-ip> expo start`.
