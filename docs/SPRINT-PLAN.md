# Lindi — Sprint Plan (Hackathon MVP)

> Execution companion to `LINDI-PRD.md`. Owns **how the 2-person team ships the testnet MVP** — sprint goals, deliverables, per-person parallel tracks, dependencies, and demo checkpoints. Product truth → PRD. Technical detail → `technical/`. Keep in sync: when scope changes in the PRD, reflect it here.

| | |
|---|---|
| **Team** | 2 people |
| **Dylan** | Fullstack — mobile frontend, design, mock-data seam, later backend wiring. Strong with vibe-code + AI coding agents. **Owns the app users see.** |
| **Ifal** | Blockchain + backend — Soroban Lindi Core contract, DeFindex/smart-account-kit/OZ Relayer integration, NestJS orchestration. **Owns the chain + server.** |
| **Strategy** | **Frontend-first, two parallel tracks that meet at one seam.** |
| **Network** | Stellar Testnet |
| **Cadence** | 6 weekly sprints + Sprint 0 (setup, mostly done) |

---

## 0. The Core Idea — Why Two People Can Move at Independent Paces

Lindi is architected around **one seam: the `LindiDataSource` interface** (`packages/shared/src/datasource.ts`) and the **types in `packages/shared`** (which mirror `DATA-MODEL.md` 1:1).

```
            ┌─────────────────────────────────────────────┐
            │     packages/shared (THE CONTRACT)           │
            │   • domain types (DATA-MODEL.md 1:1)         │
            │   • LindiDataSource interface                │
            │   • enums                                    │
            └───────────────┬─────────────────┬───────────┘
       Dylan builds UPWARD  │                 │  Ifal builds DOWNWARD
                            ▼                 ▼
        ┌───────────────────────────┐   ┌───────────────────────────────┐
        │ apps/mobile               │   │ live LindiDataSource impl       │
        │ • screens + components    │   │ (packages/stellar + backend)    │
        │ • depends ONLY on the     │   │ • Soroban Lindi Core            │
        │   interface, runs on the  │   │ • DeFindex / smart-account-kit  │
        │   MOCK impl today         │   │ • OZ Relayer · NestJS           │
        └───────────────────────────┘   └───────────────────────────────┘
                            │                 │
                            └──────┬──────────┘
                                   ▼
                    INTEGRATION SPRINT: swap mockDataSource → liveDataSource.
                    One line changes in apps/mobile/lib/datasource.ts. UI untouched.
```

**Consequences (the whole reason this plan works):**

- **Dylan never waits for the chain.** The app is fully usable on `mockDataSource` from Day 1. He can ship every screen, animation, and flow against realistic mock data.
- **Ifal never waits for the UI.** He builds and unit-tests the contract + integration behind the same interface, validated by tests, not by screens.
- **The only synchronization point is the interface.** When either person needs a new field or method, they **change `packages/shared` + `DATA-MODEL.md` first** (CLAUDE §4), then both sides adopt it. That edit is the handshake.
- **Pace independence:** Dylan can vibe-code 3 screens in a day; Ifal can spend 3 days on the default-path contract tests. Neither blocks the other as long as the seam holds.

> **Rule:** No component invents an ad-hoc data shape. No contract returns a shape the interface doesn't describe. The interface is the treaty. Break it only by editing `packages/shared` + `DATA-MODEL.md` together, and announce it.

---

## 1. Tracks & Ownership

| Layer | Owner | Notes |
|---|---|---|
| Design system / tokens (`packages/tokens`, `BRAND.md`) | **Dylan** | source of truth for color/space/type/motion |
| Mobile app (`apps/mobile`) | **Dylan** | screens, components, animations, flows |
| Mock data seam (`packages/shared` mocks) | **Dylan** (shapes co-owned) | realistic fixtures for every demo state |
| Shared types + interface (`packages/shared`) | **Co-owned** | the treaty; edit together |
| Soroban Lindi Core (`contracts/`) | **Ifal** | circle lifecycle, governance, default/penalty, vault mgmt |
| DeFindex / smart-account-kit / OZ Relayer (`packages/stellar`) | **Ifal** | integration wrappers |
| Backend orchestration (NestJS) | **Ifal** (Dylan assists late) | tx build/relay, indexer reads, notifications |
| Live `LindiDataSource` impl | **Ifal** | the real backing for the seam |
| Pitch / demo script / video | **Co-owned** | Dylan drives visuals, Ifal drives the chain story |

---

## 2. Sprint-by-Sprint

Each sprint: **Goal · Dylan track · Ifal track · Shared/seam work · Deliverables · Definition of Done · Demo checkpoint · Risks.**

> Frontend-first means Dylan's track front-loads (Sprints 1–3 are heavy UI) while Ifal's track de-risks the chain in parallel; they converge in Sprint 5 (integration).

---

### Sprint 0 — Foundation (mostly DONE ✅)

**Goal:** monorepo + design system + mock seam exist and run.

| Dylan | Ifal |
|---|---|
| ✅ Turborepo + pnpm + Expo SDK 54 app runs | ⬜ Stellar CLI + Rust/Soroban toolchain installed |
| ✅ `@lindi/tokens` + NativeWind wired (BRAND.md) | ⬜ Testnet account funded (friendbot); RPC endpoint chosen |
| ✅ `@lindi/shared` types + `LindiDataSource` + mock impl | ⬜ Read DeFindex docs; confirm testnet Factory + strategy addresses (PRD Q5) |
| ✅ UI primitive kit + style-guide screen | ⬜ Scaffold `contracts/` cargo workspace + empty Lindi Core |

**DoD:** `pnpm mobile` boots on web + Expo Go; `contracts/` compiles an empty contract; both can `git push` to the same repo.

---

### Sprint 1 — "The app feels alive" (FE) · "Hello, circle" (BC)

**Goal (Dylan):** Home + Circle Room + Discover render beautifully on mock data with signature motion. First "wow."
**Goal (Ifal):** Lindi Core can create a circle, join, contribute, and pay out (CLASSIC) on testnet USDC with vault-native shares.

**Dylan track**
- Redesign **Home**: hero greeting, aggregate "total kamu" card with the **purchasing-power-protected counter**, animated growing-pot numbers (reanimated), segmented circle filter, staggered entrance.
- Build **Discover** screen (public-pool feed: tags, tier chips, live APY range, search/filter).
- Build **Circle Room** v1: growing pot, members, who-paid, accrued yield.
- New components: `AnimatedNumber`, `ProtectCounter`, `PoolCard`, `TagChip`, `Segmented` usage.

**Ifal track**
- Lindi Core: `create_circle` (with mandatory seed deposit), `join`, `contribute`, `payout` for CLASSIC.
- Vault-native share accounting wired to a **mock DeFindex vault test double** (Rust) first.
- Unit tests for rotation correctness + share math.

**Shared/seam:** lock the `Circle`, `Membership`, `Message` shapes used by the new screens; add `tags/tierMin/cap` (already in DATA-MODEL) to `packages/shared` + fixtures.

**Deliverables:** Home + Discover + Circle Room (mock); CLASSIC contract path green in tests.
**DoD:** screens animate at 60fps on device; `cargo test` passes rotation + share tests.
**Demo checkpoint:** record a 20s screen-capture of Home → Discover (the visual hook).

---

### Sprint 2 — "Every mode + the calculator" (FE) · "Goal + Public + vault" (BC)

**Goal (Dylan):** all three modes navigable; the yield calculator works; chat thread in the circle room.
**Goal (Ifal):** GOAL + PUBLIC_POOL branches; collateral/default; unanimous early-exit penalty — with tests on the paths judges probe.

**Dylan track**
- **Yield Calculator** screen (simple + target mode), honesty ranges, USD-vs-deposito comparison. Reads `data.project()` + `data.getPresets()`.
- **Create Circle** flow (mode picker, schedule, goal, preset, auto-compound; public: tier + tags + cap).
- **Chat & Circle Room Feed** (PRD §12.9): text + system + vote_prompt + milestone messages, fused with activity.
- Components: `ChatBubble`, `SystemEvent`, `VotePromptCard`, `CalculatorCard`, `PresetPicker`.

**Ifal track**
- `complete_goal`, `deposit_public` (+ tier/cap checks), `withdraw_share` (own-share-only invariant §11.1).
- `handle_default` + collateral slash + **yield-forfeiture** (§6.1); `propose_early_exit`/`vote_early_exit` (unanimous, dynamic penalty).
- Tests: default path edges, `penalty ≤ yield`, public-pool security invariants.

**Shared/seam:** add `getMessages`/`sendMessage`(stub) + `listPublicPools(filter)` (done in mock); confirm projection types.

**Deliverables:** calculator + create-flow + chat (mock); GOAL/PUBLIC/default/penalty contract paths green.
**DoD:** calculator recommendations honest (ranges for variable presets, enforced in code); contract security tests pass.
**Demo checkpoint:** the goal-mode yield reveal works end-to-end on mock.

---

### Sprint 3 — "Onboarding wow + polish" (FE) · "DeFindex live" (BC)

**Goal (Dylan):** the invisible-crypto onboarding flow + PIN fallback UI; full design polish pass.
**Goal (Ifal):** real DeFindex vault integration (deposit/withdraw/rebalance) + group strategy voting on testnet.

**Dylan track**
- **Onboarding**: phone → username → biometric prompt → **6-digit PIN fallback** setup screens (UI; real passkey wiring in Sprint 5).
- **Group strategy vote** UI: propose, vote, live tally, "this rebalances your vault" moment.
- Polish pass with `frontend-design-guidelines` + `page-load-animations`: empty states, skeletons, transitions, haptics, micro-interactions.
- Profile/Akun screen (username, security, language toggle).

**Ifal track**
- Swap the Rust vault double for **real DeFindex testnet vault**: `create_circle` deploys/links a real vault; deposit/withdraw/rebalance.
- `propose_strategy`/`vote_strategy` → resolved vote calls `vault.rebalance` (contract-as-manager).
- Confirm Etherfuse + Blend strategies live on testnet (PRD Q5); pick fallback if not.

**Shared/seam:** finalize `buildVote`, `buildContribute`, `buildJoinCircle` prepared-tx shapes (the live impl must return these).

**Deliverables:** onboarding + vote UI (mock); real DeFindex vault round-trip on testnet.
**DoD:** app is visually demo-ready end-to-end on mock; a real testnet vault earns + rebalances via contract.
**Demo checkpoint:** "vote rebalances a real vault" works on testnet (chain side, headless).

---

### Sprint 4 — "Backend stands up" (BC-heavy) · "FE hardening" (FE)

**Goal (Ifal):** NestJS backend: tx build/relay via OZ Relayer, indexer reads, username registry, notifications.
**Goal (Dylan):** the demo-IDR loop screen + notifications UI + accessibility/i18n; begin wiring real reads.

**Dylan track**
- **Demo IDR loop** screen (Rupiah in → USDC pot → Rupiah out, honestly labeled).
- Notifications screen + WhatsApp/push copy; bilingual pass (ID default, EN toggle).
- Start replacing mock reads with backend reads where ready (feature-flagged).

**Ifal track**
- NestJS: `/circles/:id/contribute` builds unsigned tx; submit via **OZ Relayer + Channels**; webhook → confirm.
- Username↔address registry; indexer (Mercury/RPC) → materialize activity/circle caches.
- smart-account-kit server pieces; notification fan-out service.

**Shared/seam:** introduce `liveDataSource` in `packages/stellar` implementing `LindiDataSource` against the backend; keep mock as fallback.

**Deliverables:** backend serves reads + builds txs; IDR loop + notifications UI.
**DoD:** a contribution can flow client→backend→relayer→testnet in a script; reads come from indexer.
**Demo checkpoint:** one real gasless contribution submitted end-to-end (no UI yet required).

---

### Sprint 5 — INTEGRATION ("flip the seam")

**Goal:** swap `mockDataSource → liveDataSource` and make the real app work on testnet. The two tracks converge.

**Both**
- Flip `apps/mobile/lib/datasource.ts` to the live impl (one line); fix shape mismatches at the seam (not in components).
- Wire real **biometric onboarding** (smart-account-kit) + PIN fallback to the device secure store.
- Real growing-pot from live vault share price; real vote→rebalance from the app; real default/penalty demo.
- End-to-end on testnet: onboard → create/join → contribute (gasless) → vote → pot grows → payout/early-exit.

**Deliverables:** the **real app** running on testnet, all core flows.
**DoD:** every demo beat works against the chain (pre-staged where needed); no mock in the critical path.
**Demo checkpoint:** full 3-min flow rehearsed once on real testnet.

---

### Sprint 6 — DEMO HARDENING & SUBMISSION

**Goal:** flawless demo + submission assets. (PRD §17.)

**Both**
- Pre-stage all demo state (pre-fund wallets, pre-advance yield so growth is visible).
- Record **backup video** of the full flow. Rehearse the 3-min script **5+ times**.
- Pitch deck + ecosystem-composition slide + the combined hero beat (protection × discovery, D19).
- Buffer for bugs; final scope-cuts per PRD §14.4 if needed.
- SCF Build Award application draft.

**Deliverables:** rehearsed live demo, backup video, deck, submission.
**DoD:** demo runs start-to-finish without a live failure; backup exists; submission complete.

---

## 3. Dependency Map (what blocks what)

```
packages/shared (treaty) ──┬──▶ apps/mobile (Dylan, any time)
                           └──▶ live impl (Ifal, any time)

Ifal: contract CLASSIC ──▶ GOAL/PUBLIC ──▶ DeFindex live ──▶ backend relay ──┐
Dylan: Home/Discover ──▶ all modes+calc ──▶ onboarding+polish ──────────────┤
                                                                            ▼
                                                            Sprint 5 INTEGRATION
                                                                            ▼
                                                            Sprint 6 DEMO
```

**Hard dependencies (few, by design):**
- Integration (S5) needs Ifal's live impl returning interface-shaped data **and** Dylan's UI complete on mock. Both reach "done on their side" by end of S4.
- Real onboarding (S5) needs smart-account-kit testnet round-trip (Ifal, S3–S4) + onboarding UI (Dylan, S3).
- Nothing in S1–S3 on Dylan's side blocks on the chain (mock covers it). **This is the whole point.**

---

## 4. The Seam Discipline (how the two stay in sync without meetings)

1. **Single source of types:** `packages/shared` mirrors `DATA-MODEL.md`. Change one → change both, in the same commit.
2. **New field/method?** Edit `DATA-MODEL.md` + `packages/shared` + the mock impl **first**, push, ping the other person. Then build against it.
3. **Mock stays canonical:** the mock impl always satisfies the full interface. If Ifal adds a method, Dylan's mock gets a stub the same day so the app keeps compiling.
4. **Live impl must match the mock's shapes exactly** — verified by both implementing the same `LindiDataSource` type (TS enforces it).
5. **Prepared-tx contract:** all writes return `PreparedTx`. Mock = fake id; live = XDR + auth entries. UI only ever calls `data.buildX()` then signs — it never constructs a tx.

---

## 5. Definition of Done (global, every sprint)

- TypeScript: `pnpm typecheck` clean. Rust: `cargo test` green.
- No hardcoded hex/space/font in components (tokens only — CLAUDE §3).
- No ad-hoc data shapes (interface only — CLAUDE §4).
- Honesty model enforced in code, not just copy (variable presets render as ranges — PRD §9.4).
- Default + penalty + public-pool-security paths have tests (judges probe them).
- Each sprint ends with a recorded demo clip of that sprint's hero.

---

## 6. Risk Register (sprint-level; full list → PRD §18)

| Risk | Sprint | Owner | Mitigation |
|---|---|---|---|
| DeFindex Etherfuse strategy not live on testnet | S3 | Ifal | fallback: Blend pool holding USTRY / direct USTRY vault (PRD Q5) |
| Integration shape mismatches at the seam | S5 | Both | the treaty discipline (§4); TS catches most at compile time |
| smart-account-kit passkey on device flaky | S5 | Ifal/Dylan | pre-enrolled device + PIN fallback + backup video |
| Frontend polish eats integration time | S4–S5 | Dylan | freeze design at end of S3; S4+ is wiring, not redesign |
| Scope creep (social layer balloons) | all | Both | D16 = light only; reputation/P2P are post-MVP (PRD §21.4.1) |

---

## 7. Parallelization Cheat-Sheet (Dylan ‖ Ifal, by week)

| Week | Dylan (frontend, vibe-code) | Ifal (chain + backend) |
|---|---|---|
| **S1** | Home + Discover + Circle Room (mock) | Lindi Core CLASSIC + share math + tests |
| **S2** | Calculator + Create flow + Chat | GOAL/PUBLIC + default/penalty + security tests |
| **S3** | Onboarding + Vote UI + polish | Real DeFindex vault + governance→rebalance |
| **S4** | IDR loop + notifications + i18n | NestJS + Relayer + indexer + registry |
| **S5** | **Flip seam → live**, wire onboarding | **Flip seam → live**, expose live impl |
| **S6** | Demo polish, deck visuals, backup video | Pre-stage chain state, rehearse chain story |

> Two lanes, one finish line. The mock seam is the guardrail that keeps them from colliding.
