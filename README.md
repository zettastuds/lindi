# Lindi

Group savings on Stellar — arisan + USD-protected yield, invisible crypto. APAC Stellar Hackathon 2026.

> **Docs are the source of truth.** Start with `docs/LINDI-PRD.md` (product bible), then `CLAUDE.md` (engineering guide), `docs/BRAND.md` (design), and `docs/technical/*`.

## Monorepo layout

```
lindi/
├── apps/
│   └── mobile/          # Expo React Native app (NativeWind). Runs on mock data today.
├── packages/
│   ├── tokens/          # design tokens (mirrors docs/BRAND.md) — single source
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

## Run (frontend)

```bash
corepack enable
pnpm install            # hoisted layout (see .npmrc) — required for Expo + pnpm
pnpm --filter @lindi/mobile dev   # or: pnpm mobile
# scan the QR with Expo Go on your phone (same network; --tunnel if WSL networking blocks it)
```

## Scripts (root, via Turborepo)

| Command | Does |
|---|---|
| `pnpm dev` | run dev tasks |
| `pnpm typecheck` | typecheck all packages |
| `pnpm lint` | lint all |
| `pnpm mobile` | start the Expo app |

Backend (`apps/api`, NestJS) and `contracts/` come next — see the docs.
