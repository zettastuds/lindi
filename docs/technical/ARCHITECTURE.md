# Lindi — System Architecture

> Technical companion to `LINDI-PRD.md`. This doc owns the *how* at the system level: layers, data flow, trust boundaries, and the request lifecycle. Contract internals → `SMART-CONTRACTS.md`. Third-party integration detail → `INTEGRATIONS.md`. Yield math → `YIELD-ENGINE.md`. Entities → `DATA-MODEL.md`.

| | |
|---|---|
| **Status** | Living document — update when reality diverges |
| **Network (MVP)** | Stellar **Testnet** |
| **Contract platform** | Soroban (Rust / WASM) |
| **Last Updated** | June 2026 |

---

## 1. Design Goals (in priority order)

1. **Invisible crypto.** User signs with biometrics; never sees keys, gas, or addresses.
2. **Custody minimized.** Funds live in audited contracts (DeFindex vaults, the Lindi Core contract), not in a Lindi-controlled hot wallet. Lindi is an *orchestrator*, not a custodian.
3. **Compose, don't reinvent.** Yield = DeFindex. Auth = OZ Smart Accounts. Gas = OZ Relayer. Lindi writes only the circle/governance/identity layer.
4. **Deterministic, testable contract.** All money-moving logic on-chain and unit-tested (default + penalty paths especially).
5. **Demo-safe.** Every load-bearing path can be pre-staged; nothing critical depends on a live third-party call during the demo.

---

## 2. The Four Layers

```
┌──────────────────────────────────────────────────────────────────────┐
│ 1. CLIENT  — Mobile app (React Native or Flutter)                     │
│    • Biometric onboarding (smart-account-kit)                         │
│    • Circle room · growing-pot UI · strategy vote · yield calculator  │
│    • Holds NO private keys in app code — passkey lives in secure HW    │
└─────────────────────────────┬────────────────────────────────────────┘
                              │ HTTPS (REST/gRPC) + signed XDR
┌─────────────────────────────▼────────────────────────────────────────┐
│ 2. BACKEND  — Orchestration service (Node/TS or Python/FastAPI)       │
│    • Username ↔ address registry        • Projection / yield engine    │
│    • Notification fan-out (WhatsApp/push)• Indexer reads (RPC/Mercury) │
│    • Builds unsigned tx → returns to client → relays signed tx         │
│    • Submits via OpenZeppelin Relayer (+ Channels)                     │
│    • Holds NO user funds. Stateless re: custody.                       │
└──────────────┬──────────────────────────────┬────────────────────────┘
               │ submit (sponsored)            │ read state
┌──────────────▼──────────────┐  ┌─────────────▼─────────────────────────┐
│ 3a. OZ RELAYER + CHANNELS    │  │ 3b. STELLAR RPC / INDEXER             │
│   • Fee sponsorship          │  │   • Stellar RPC (getEvents, sim)     │
│   • Channel-account pool      │  │   • Mercury/Zephyr (event indexing)  │
│   • Retry · fee-bump · webhook│  │   • Horizon (legacy fallback)        │
└──────────────┬──────────────┘  └───────────────────────────────────────┘
               │ paid tx
┌──────────────▼────────────────────────────────────────────────────────┐
│ 4. STELLAR / SOROBAN                                                   │
│                                                                        │
│   ┌────────────────────┐   ┌──────────────────────────────────────┐   │
│   │ User Smart Account │   │   LINDI CORE CONTRACT                 │   │
│   │ (OZ stellar-       │──▶│   • Circle lifecycle / membership     │   │
│   │  contracts; P256   │   │   • Contributions / share tracking    │   │
│   │  __check_auth)     │   │   • Payout / withdraw / penalty       │   │
│   └────────────────────┘   │   • Governance vote → vault rebalance  │   │
│                            │   • Collateral / default handling      │   │
│                            └──────────┬───────────────────────────┘   │
│                                       │ deposit / withdraw / rebalance │
│                            ┌──────────▼───────────┐                    │
│                            │ DeFindex Vault         │  (one per Circle) │
│                            │ → Blend / Etherfuse    │                   │
│                            │   strategies           │                   │
│                            └──────────┬─────────────┘                   │
│              ┌──────────────┐  ┌──────▼──────┐  ┌──────────────┐        │
│              │   Soroswap   │  │ Blend pools │  │  Etherfuse   │        │
│              │ (swap util)  │  │ (lending)   │  │ (treasury)   │        │
│              └──────────────┘  └─────────────┘  └──────────────┘        │
│                              ┌──────────────┐                          │
│                              │  Reflector   │ (price oracle, IDR disp) │
│                              └──────────────┘                          │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Trust & Custody Boundaries

| Actor | Can it move user funds? | How constrained |
|---|---|---|
| **User smart account** | Yes — its own funds only | OZ `__check_auth` requires the user's P256 (passkey) signature, plus any policy rules (spend limits, session keys) |
| **Lindi Core contract** | Yes — per circle rules, requires member auth for member actions | Open-source, audited (prod); deterministic; cannot exceed a circle's recorded shares |
| **Lindi backend** | **No** | Builds *unsigned* transactions; never holds keys to user funds. Can only relay what the user signed. Worst case compromise → can spam/grief, not steal |
| **OZ Relayer** | Pays gas only | Funds a fee account; signs the *fee* envelope, not the user's auth. Cannot redirect funds |
| **DeFindex vault** | Holds the pot | Audited 3rd-party; non-custodial; Lindi (as manager) can rebalance/withdraw per vault role, but withdrawals settle to the circle/members per Core-contract logic |

**Key property:** A full compromise of the Lindi backend cannot drain user funds, because the backend never possesses signing authority over user smart accounts or the vault's withdraw-to-arbitrary-address path. Withdrawals are gated by the on-chain Core contract + user auth.

> ⚠️ Production caveat: Lindi-as-vault-manager is a privileged role. The manager key must be a multisig / policy-gated account, **not** a single backend key. See `INTEGRATIONS.md` §DeFindex roles and `SMART-CONTRACTS.md` §manager-authority.

---

## 4. The Canonical Request Lifecycle (gasless write)

Every state-changing user action follows this pattern. Example: "Bu Sri contributes Rp500k to round 3."

```
1. CLIENT  → BACKEND:  POST /circles/{id}/contribute { round, amount }
2. BACKEND:            builds UNSIGNED Soroban tx
                       (invoke lindi_core.contribute) + simulates (RPC simulateTransaction)
                       returns prepared XDR + auth entries to client
3. CLIENT:             prompts Face ID → smart-account-kit signs the auth entry
                       with the device passkey (P256). Returns signed auth.
4. CLIENT  → BACKEND:  POST signed auth entries
5. BACKEND → RELAYER:  submit tx; Relayer assigns a channel account,
                       sponsors the fee, signs fee envelope, submits to network
6. RELAYER → NETWORK:  tx included; Relayer retries / fee-bumps if needed
7. RELAYER → BACKEND:  webhook "confirmed" (tx hash, ledger)
8. BACKEND → CLIENT:   push/WS "contribution confirmed"; UI updates pot balance
9. BACKEND:            (async) notify other members via WhatsApp/push
```

**Notes**
- Step 2 simulation catches failures *before* asking the user to sign — no wasted prompts.
- Step 5: the **channels plugin** is what lets many users contribute in the same few seconds without sequence-number collisions — each goes out on a separate channel account.
- Read-only screens (pot balance, ledger) **never** hit this path; they read from the indexer (§5).

---

## 5. Read Path (state display)

Display is decoupled from writes for speed and demo-safety.

| Screen | Source | Mechanism |
|---|---|---|
| Pot balance / accrued yield | DeFindex vault share price × circle shares | RPC `getLedgerEntries` on vault; or indexed |
| Transparent ledger | Lindi Core events | Mercury/Zephyr indexed events; RPC `getEvents` fallback |
| Live preset APY | DeFindex API / strategy reads | Backend caches; refreshed on interval |
| IDR-equivalent | Reflector oracle (or hardcoded rate in MVP) | Backend reads price feed |
| Who's paid / whose turn | Lindi Core storage | Indexed; RPC fallback |

**Caching:** backend caches APY + IDR rate (TTL ~minutes). Growing-pot number can interpolate client-side between refreshes for a smooth "ticking up" feel.

---

## 6. Why Each External Piece (one line each)

| Piece | Why it exists in the stack | Alternative rejected |
|---|---|---|
| **smart-account-kit** | Native Stellar biometric smart wallets (P256) | passkey-kit (legacy), Privy (EVM/Solana-centric) |
| **OZ `stellar-contracts`** | Audited on-chain `__check_auth` + policy rules | Hand-rolled secp256r1 verification (audit risk) |
| **OZ Relayer + Channels** | Gasless UX + parallel submission + tx lifecycle | Launchtube (superseded for this stack), self-managed sequence pool |
| **DeFindex** | One integration → Blend + Etherfuse, audited, share accounting free | Direct Blend/Etherfuse integration (more surface, no share token) |
| **Soroswap** | Swap utility only | — (not used for yield; see PRD §11 note) |
| **Reflector** | IDR-equivalent display pricing | Hardcoded rate (MVP fallback) |

---

## 7. Environments

| Env | Network | Assets | Yield | Auth | Gas |
|---|---|---|---|---|---|
| **Local/dev** | Soroban local / Futurenet | mock USDC + demo-IDR | mock/single strategy | test passkey | local |
| **MVP / demo** | **Testnet** | testnet USDC + testnet demo-IDR asset | DeFindex testnet strategies (verify availability, Q5) | smart-account-kit testnet | OZ Relayer testnet |
| **Production** | Mainnet | mainnet USDC | DeFindex mainnet strategies (Blend + Etherfuse) | smart-account-kit mainnet | OZ Relayer mainnet (funded) |

> **Gating check (PRD Q5):** confirm Blend + Etherfuse DeFindex strategies are deployed and funded on **testnet** before committing the 3-preset demo. Fallback: single USDC strategy vault (Q2).

---

## 8. Failure Modes & Demo Safety

| Failure | Mitigation |
|---|---|
| Live DeFindex strategy unavailable on testnet | Pre-stage vault state; fall back to single strategy; or pre-record |
| Relayer down during demo | Pre-staged state + backup video; local fee account fallback |
| Passkey prompt fails on stage device | Pre-enrolled device + backup video |
| Yield reveal needs time to accrue | **Pre-advance**: seed vault earlier so growth is visible at demo time |
| IDR oracle (Reflector) latency | Hardcode display rate for MVP |

Principle: **nothing on the critical demo path makes a live, failable third-party call that isn't pre-staged.** (PRD §17.3)

---

## 9. Tech Stack Summary

| Layer | Choice | Notes |
|---|---|---|
| Smart contract | Soroban (Rust), `soroban-sdk` | Lindi Core |
| On-chain auth lib | OpenZeppelin `stellar-contracts` | account abstraction |
| Client SDK | `@stellar/stellar-sdk` (JS) | tx build/sim/submit |
| Wallet | `smart-account-kit` (kalepail) | P256 smart accounts |
| Gas/relay | OpenZeppelin Relayer + `relayer-plugin-channels` | sponsored, parallel |
| Yield | `@defindex/sdk` (paltalabs) | vault create/deposit/withdraw/rebalance |
| Swap (util) | Soroswap SDK/API | low priority |
| Oracle | Reflector | IDR display |
| Indexer | Mercury / Zephyr; RPC fallback | events/state |
| Mobile | React Native **or** Flutter (Q1) | Flutter has proven Soroban passkey demo |
| Backend | Node/TS or Python/FastAPI | orchestration |
| Notifications | WhatsApp Cloud API + push | |

---

## 10. Open Architecture Questions (mirror PRD §22)

- **Q1** Mobile framework (RN vs Flutter).
- **Q2** Single-strategy vs 3-preset vault for MVP.
- **Q5** Verify live DeFindex testnet strategies.
- **Q11** Who funds the mandatory vault seed deposit at circle creation.
- **Manager-key security** (prod): the vault-manager role must be policy/multisig-gated, not a single backend key.
