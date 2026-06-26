# Lindi — External Integrations

> Technical companion to `LINDI-PRD.md`. Owns every third-party touchpoint: DeFindex (yield hero), OpenZeppelin Relayer + Channels (gas), smart-account-kit + OZ `stellar-contracts` (auth), Soroswap (swap util), Reflector (oracle). System view → `ARCHITECTURE.md`. Contract-side calls → `SMART-CONTRACTS.md`. Yield math → `YIELD-ENGINE.md`.

> ⚠️ **Verify before relying.** API/SDK signatures below are derived from docs/repos at time of writing. Confirm against the live SDK version during build. Repos/docs linked per section.

---

## 1. DeFindex — the yield hero

**Repo (TS SDK):** https://github.com/paltalabs/defindex-sdk · **Docs:** https://docs.defindex.io/ · `npm install @defindex/sdk`

### 1.1 What it is
A non-custodial vault protocol. Three contract kinds: **Factory** (deploys vaults), **Vault** (holds funds, mints `dfToken` shares, charges fee-on-yield), **Strategy** (puts funds to work). Lindi integrates as a **vault integrator** — it uses existing audited strategies, it does **not** write new ones (PRD §9.7).

### 1.2 Confirmed strategies (mainnet, June 2026)
| Family | Asset | Strategy address |
|---|---|---|
| Fixed Pool (Blend) | USDC | `CDB2WMKQQNVZMEBY7Q7GZ5C7E7IAFSNMZ7GGVD6WKTCEWK7XOIAVZSAP` |
| Fixed Pool (Blend) | EURC | `CC5CE6MWISDXT3MLNQ7R3FVILFVFEIH3COWGH45GJKL6BD2ZHF7F7JVI` |
| Fixed Pool (Blend) | XLM | `CDPWNUW7UMCSVO36VAJSQHQECISPJLCVPDASKHRC5SEROAAZDUQ5DG2Z` |
| Etherfuse Pool v2 | USDC | `CCBTSHPUVNKCT5V675AAVYNANHXBU26PTZK2QLS7ZLFNYRJZT5HW3VL6` |
| Etherfuse Pool v2 | CETES (MX) | `CAZ3LLLKPWEOVK6K4G5NCQ2VXWABLFIPKKNMN5GLKMZKEN7JSKTEMIKN` |
| Etherfuse Pool v2 | USTRY (US) | `CA3SO5RRKOONAPWVR5XY6CMOYZGN4M4QKVIGX5DFRIIJUJW2SFSELBXL` |
| Etherfuse Pool v2 | TESOURO (BR) | `CDSCVJHJWUZQMR64FVK3XMND5NKSN7Z23KPRCHKFHVGOEJBWPVH5B5XA` |

All Etherfuse strategies **autocompound** natively (relevant to the auto-compound toggle, PRD §8.8). **Testnet addresses differ — fetch from DeFindex testnet deployment before MVP (PRD Q5).**

### 1.3 The vault share model (`dfToken`)
- Vault starts with **0 shares, 0 assets**. First deposit mints **1:1**.
- Later deposits: `shares = amount * total_supply / (total_assets)` (pre-deposit assets). Yield raises `total_assets`, so later depositors get fewer shares per dollar — correct.
- The vault contract **is** the `dfToken`. Share value = `total_assets / total_supply`.
- Lindi uses this as its share ledger (`SMART-CONTRACTS.md` §4).

### 1.4 Vault creation — mandatory seeded first deposit
The factory deploy + first deposit happen **in one transaction**; the deployer must hold the seed asset. The first deposit also sets the **strategy allocation ratio** for multi-strategy vaults (the contract learns the ratio by seeing one real split). → maps to Lindi `create_circle` (PRD Q11: creator's first contribution = seed).

### 1.5 Core SDK surface (verify signatures)
```ts
import { DefindexSDK } from "@defindex/sdk";
const sdk = new DefindexSDK({ network: "testnet" /* | "mainnet" */ });

// create a per-circle vault (Factory) — single or multi-strategy, with fee + manager
await sdk.createVault({
  asset, strategies: [{ address, allocationBps }], // preset → allocation
  manager,          // Lindi Core contract address (contract-as-manager preferred)
  feeReceiver,      // Lindi fee receiver
  vaultFeeBps,      // fee on YIELD (<= 9000)
  seedAmount,       // mandatory first deposit
});

await sdk.deposit({ vault, amount, from });     // returns shares minted
await sdk.withdraw({ vault, shares, to });      // burns shares -> asset
await sdk.rebalance({ vault, allocations });    // manager-only; governance vote triggers
const info = await sdk.getVault(vault);         // total_assets, total_supply, price/share, APY
```
> The HTTP API mirrors this: `GET /vault/{address}?network=…`, `POST /vault/{address}/lock-fees`, deposit/withdraw build endpoints. Use whichever (SDK in client/backend; API for serverless). Confirm exact method names against installed SDK.

### 1.6 Fee model (revenue — PRD §16)
- Fee charged on **yield only**, never principal. If no yield, no fee.
- **Max partner fee = 9000 BPS (90%)** of generated yield. Set via `vaultFeeBps` at creation or `POST /vault/{address}/lock-fees { new_fee_bps }`.
- Of the collected fee, **DeFindex protocol takes ~20%, Lindi keeps ~80%** (the negotiated split; `defindexFee`/`DeFIndexProtocolFeeRate` BPS set at vault init).
- Lindi's chosen `vaultFeeBps` is a product knob (PRD Q7) — a modest fraction of yield, not the 90% cap.

### 1.7 Roles & security
- **Manager** can rebalance/emergency-manage. **Make this the Lindi Core contract** (contract-as-manager) so no off-chain key controls funds; rebalance only via resolved governance vote. If an external manager key is unavoidable → multisig/policy-gated (ARCHITECTURE §3).
- **Fee receiver** = Lindi treasury address.
- Strategies are fixed/audited; Lindi cannot add arbitrary strategies (deliberate security boundary, PRD note 7).

### 1.8 Preset → strategy mapping
See `YIELD-ENGINE.md` §allocations. Summary: Conservative→Etherfuse; Balanced→Etherfuse+Blend Fixed; Growth→Blend YieldBlox-weighted.

---

## 2. OpenZeppelin Relayer + Channels — gasless + parallel

**Relayer:** https://github.com/OpenZeppelin/openzeppelin-relayer · **Channels plugin:** https://github.com/OpenZeppelin/relayer-plugin-channels

### 2.1 Why (replaces Launchtube)
1. **Sponsored gas** — Relayer pays fees from a funded account; new users need no XLM. Replaces Launchtube's role.
2. **Channels (parallelism)** — a pool of independent channel accounts; bursts of user txs go out on separate sequence numbers in parallel, no jamming. Critical when a whole arisan contributes within seconds.
3. **Lifecycle** — auto retry on drop, **fee-bump** on congestion, **webhook** on confirmation.

### 2.2 Flow (see ARCHITECTURE §4)
```
backend → Relayer.submit(signed_user_tx)
Relayer: pick channel acct → wrap/sponsor fee → sign fee envelope → submit
Relayer: retry / fee-bump as needed → webhook(confirmed) → backend
```
The Relayer signs **the fee/source**, not the user's auth entry — it cannot move user funds (custody boundary, ARCHITECTURE §3).

### 2.3 Setup checklist
- Deploy Relayer (Docker); fund the fee account (testnet XLM for MVP).
- Enable `relayer-plugin-channels`; provision N channel accounts (size to expected burst).
- Configure webhook → Lindi backend `/relayer/webhook`.
- Per-tx: submit prepared+signed XDR; poll or await webhook.

---

## 3. smart-account-kit + OZ stellar-contracts — invisible auth

**Kit:** https://github.com/kalepail/smart-account-kit · **Contracts:** https://github.com/OpenZeppelin/stellar-contracts

### 3.1 Roles
- **smart-account-kit (client/TS):** create a smart account, enroll a passkey (WebAuthn/P256), sign auth entries with Face ID/fingerprint. Supports P256 + Ed25519 + policy signers, session keys, multisig, spend limits.
- **OZ `stellar-contracts` (on-chain):** the account contract's `__check_auth` — verifies the P256/WebAuthn signature on-chain and enforces context/policy rules. This is the "rule enforcer" that lets Soroban accept a biometric signature natively.

### 3.2 Onboarding flow
```
client: smartAccount = kit.create({ name: username })   // deploys account contract
client: kit.enrollPasskey(smartAccount)                  // Face ID → P256 key registered on-chain
backend: map username -> smartAccount.address            // identity registry (PRD §8.6)
(gas for deploy sponsored by OZ Relayer)
```

### 3.3 Signing (per write)
```
prepared = backend.build(invoke lindi_core.contribute ...)   // unsigned + auth entries
signedAuth = kit.sign(prepared, smartAccount)                // Face ID prompt -> P256 sig
backend → Relayer.submit(prepared + signedAuth)
```
`lindi_core` does `member.require_auth()`; resolution runs the account's `__check_auth` (P256 verify + policy). Lindi Core never verifies signatures itself.

### 3.4 Policy ideas (prod)
- Spend limits per session key (e.g. contributions ≤ X/day without re-prompt).
- Backup passkey on a second device → recover account without new address (PRD UX promise).
- Session keys for low-friction repeat contributions.

---

## 4. Soroswap — swap utility only

**Docs:** https://docs.soroswap.finance/ · low priority (PRD note 4).

- Used **only** when an asset conversion is needed (e.g. settle a non-USDC asset → USDC before vault deposit/withdraw). DeFindex strategies may already route swaps internally; Lindi calls Soroswap directly only at the edges.
- **Not a yield source.** Soroswap "Earn" = DeFindex under the hood; Soroswap AMM LP fee yield (0.3% pro-rata) is not exposed as a DeFindex strategy, so Lindi does not use it (PRD §11 note).
- MVP: **stub** the swap (single-asset USDC flow needs no swap). Keep the call site so it's integration-ready.

```ts
// illustrative
const quote = await soroswap.getBestRoute({ from, to, amount });
const tx = await soroswap.buildSwap(quote, { to: recipient, slippageBps });
```

---

## 5. Reflector — price oracle (IDR display)

- Supplies price feeds for **IDR-equivalent display** and any cross-asset pricing.
- MVP: **hardcode** the IDR/USD display rate to avoid live-feed latency on stage; keep the read path so prod swaps in the live feed.
- Never used for fund-moving decisions in MVP (display only).

---

## 6. Indexer — Mercury / Zephyr (+ RPC fallback)

- Index Lindi Core events (`SMART-CONTRACTS.md` §10) for the ledger view and circle-room reads.
- Stellar RPC `getEvents` / `getLedgerEntries` as fallback and for vault share-price reads.
- Horizon = legacy fallback only.

---

## 7. Integration Risk & Fallback Matrix

| Integration | MVP criticality | Fallback if it fails |
|---|---|---|
| DeFindex | **Critical** | single-strategy USDC vault; pre-staged vault state; mock vault in tests |
| OZ Relayer + Channels | **Critical** | pre-staged state + backup video; local fee account |
| smart-account-kit / OZ contracts | **Critical** | pre-enrolled device + backup video |
| Soroswap | Low | stub (single-asset flow) |
| Reflector | Low | hardcoded display rate |
| Indexer | Medium | RPC `getEvents` direct |

---

## 8. Pre-build Verification Checklist (do first)

- [ ] DeFindex **testnet** Factory + Blend/Etherfuse strategy addresses (PRD Q5).
- [ ] `@defindex/sdk` version + confirm `createVault/deposit/withdraw/rebalance/getVault` signatures.
- [ ] Confirm vault supports **contract-as-manager** (Lindi Core as manager).
- [ ] OZ Relayer deployable on testnet; channels plugin configured; webhook reachable.
- [ ] smart-account-kit testnet passkey enroll + sign round-trip on target mobile framework (Q1).
- [ ] Testnet USDC SAC address + mint a testnet demo-IDR asset.
