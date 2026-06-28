# Lindi

Group savings on Stellar — arisan + USD-protected yield, invisible crypto. APAC Stellar Hackathon 2026.

> **Docs are the source of truth.** Start with `docs/LINDI-PRD.md` (product bible), then `CLAUDE.md` (engineering guide), `docs/BRAND.md` (design), and `docs/technical/*`.

## Monorepo layout

```
lindi/
├── apps/
│   └── mobile/          # Expo React Native app (NativeWind). Runs on mock data today.
├── packages/
│   ├── tokens/          # design tokens (mirrors docs/BRAND.md) — single source of truth
│   ├── shared/          # types + enums + LindiDataSource seam + mock data (mirrors DATA-MODEL.md)
│   ├── stellar/         # LIVE data source (placeholder — blockchain team fills in)
│   └── config/          # shared tsconfig base
├── contracts/           # Soroban Rust (placeholder — own toolchain)
└── docs/                # PRD, BRAND, CLAUDE-referenced technical docs
```

## The data seam (why blockchain can come later)

The mobile app depends only on `LindiDataSource` (`@lindi/shared`). Today it's backed by
`mockDataSource` (fixtures). Later, `@lindi/stellar` implements the same interface against
real chain/backend, and `apps/mobile/lib/datasource.ts` swaps one line. **No UI changes.**

## Stack

| Layer | Choice |
|---|---|
| Monorepo | Turborepo + pnpm workspaces (hoisted layout) |
| Mobile | Expo SDK 54 · React Native 0.81.5 · expo-router 6 |
| Styling | NativeWind 4 · Tailwind · react-native-reusables |
| Animation | react-native-reanimated 4 · react-native-worklets |
| Shared | `packages/{shared,stellar,tokens,config}` (TypeScript) |
| Contracts | Soroban (Rust) in `contracts/` |
| Yield | DeFindex (`@defindex/sdk`) |
| Auth | smart-account-kit + OZ stellar-contracts (P256 passkeys) |
| Gas | OpenZeppelin Relayer + relayer-plugin-channels |

## Run (frontend)

```bash
corepack enable
pnpm install            # hoisted layout (see .npmrc) — required for Expo + pnpm
pnpm mobile             # start Expo dev server (LAN mode)
```

Scan the QR with **Expo Go** on your phone.

> **WSL2 users:** Metro binds to the WSL2 internal IP (`172.x`), which your phone can't reach over WiFi.
> Use tunnel mode instead:
> ```bash
> pnpm mobile:tunnel    # ngrok tunnel — works from any network
> ```
> For a faster local alternative, see the Windows port-proxy instructions in `CLAUDE.md §7`.

## Scripts

| Command | Does |
|---|---|
| `pnpm mobile` | start Expo app (LAN mode) |
| `pnpm mobile:tunnel` | start Expo app via ngrok tunnel (required for WSL2 + physical device) |
| `pnpm dev` | run all dev tasks via Turborepo |
| `pnpm typecheck` | typecheck all packages |
| `pnpm lint` | lint all packages |

## Design system

All colors, spacing, radii, and font keys live in `packages/tokens`. The NativeWind theme in
`apps/mobile/tailwind.config.js` pulls from there — no hardcoded hex anywhere in components.
See `docs/BRAND.md` for the full design spec.

---

Backend (`apps/api`, NestJS) and `contracts/` come next — see `docs/technical/ARCHITECTURE.md`.
