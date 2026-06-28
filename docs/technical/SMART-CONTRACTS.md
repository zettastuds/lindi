# Lindi — Smart Contracts

> Technical companion to `LINDI-PRD.md`. Owns the Lindi Core Soroban contract: storage, functions, the vault-as-circle model, governance→rebalance, default + penalty logic, auth, and testing. System context → `ARCHITECTURE.md`. Third-party calls → `INTEGRATIONS.md`. Entity field reference → `DATA-MODEL.md`.

| | |
|---|---|
| **Language** | Rust (`soroban-sdk`) |
| **Network (MVP)** | Testnet |
| **Auth model** | OZ Smart Accounts (`require_auth` on member addresses) |
| **Custody** | Funds in per-circle DeFindex vault, not in this contract's balance |

---

## 1. Contract Topology

Two contract kinds matter to Lindi:

1. **Lindi Core** — *one deployed contract* (the factory + registry of all circles), OR a factory that deploys one Core instance per circle. **Decision (MVP):** a **single Core contract** holding all circles in keyed storage (simpler deploy, cheaper). Per-circle isolation is logical (keyed by `circle_id`), financial isolation is physical (each circle = its own DeFindex vault).
2. **User Smart Accounts** — deployed per user via `smart-account-kit` / OZ `stellar-contracts`. Lindi does not author these; it only calls into them implicitly via `require_auth`.

```
Lindi Core (single contract)
 ├── circles: Map<CircleId, Circle>
 ├── members: Map<(CircleId, Address), Member>
 ├── pots:    Map<CircleId, Pot>
 ├── votes:   Map<CircleId, StrategyVote>
 └── per circle → external DeFindex Vault contract (address stored in Circle)
```

---

## 2. Storage Model

Use **persistent** storage for circle/member/pot state (must survive), **instance** storage for global config, **temporary** for ephemeral vote tallies if desired. Bump TTL on active circles.

```rust
#[contracttype]
pub enum DataKey {
    Admin,
    Config,
    Circle(u64),                 // circle_id -> Circle
    Member(u64, Address),        // (circle_id, addr) -> Member
    Pot(u64),                    // circle_id -> Pot
    Vote(u64),                   // circle_id -> StrategyVote
    MemberList(u64),             // circle_id -> Vec<Address>
    NextCircleId,
}
```

> Full field-level definitions live in `DATA-MODEL.md`. Summary types below for function context.

```rust
#[contracttype]
pub enum Mode { ClassicRotating, GoalBased, PublicPool }

#[contracttype]
pub enum Order { ByOrder, RandomNoRepeat, Bid }   // CLASSIC payout ordering

#[contracttype]
pub enum Preset { Conservative, Balanced, Growth }

#[contracttype]
pub enum CircleStatus { Forming, Active, Completed, Defaulted }

#[contracttype]
pub struct Circle {
    pub id: u64,
    pub mode: Mode,
    pub creator: Address,
    pub asset: Address,            // SAC address of deposit asset (testnet USDC)
    pub vault: Address,            // this circle's DeFindex vault
    pub preset: Preset,
    pub order: Order,              // CLASSIC only
    pub contribution_amount: i128, // per round (CLASSIC/GOAL)
    pub round_duration: u64,       // ledgers/seconds
    pub total_rounds: u32,
    pub current_round: u32,
    pub auto_compound: bool,
    pub goal_label: Option<Bytes>, // GOAL: user text ("Umroh")
    pub goal_amount: Option<i128>, // GOAL
    pub goal_date: Option<u64>,    // GOAL
    pub goal_changed: bool,        // GOAL: change-once guard
    pub published: bool,           // PUBLIC_POOL: discoverable in Discover feed
    pub tier_min: i128,            // PUBLIC_POOL: minimum deposit (commitment tier); 0 = none
    pub cap: Option<i128>,         // PUBLIC_POOL: optional max pool size (asset units)
    pub status: CircleStatus,
}
// Interest/goal tags for the Discover feed are off-chain (indexer/DB) keyed by circle_id — see DATA-MODEL.md. On-chain stays minimal.

#[contracttype]
pub struct Member {
    pub addr: Address,
    pub total_contributed: i128,
    pub shares: i128,              // vault shares attributable to this member
    pub has_received: bool,        // CLASSIC: already won the pot
    pub collateral_locked: i128,
    pub active: bool,              // false = defaulted/exited
}

#[contracttype]
pub struct Pot {
    pub vault_shares_total: i128,  // total dfTokens this circle holds
    pub current_round: u32,
    pub payout_order: Vec<Address>,// resolved order (CLASSIC)
    pub winners: Vec<Address>,     // RandomNoRepeat exclusion set
}

#[contracttype]
pub struct StrategyVote {
    pub proposed: Preset,
    pub votes: Map<Address, bool>,
    pub quorum: u32,
    pub resolved: bool,
}
```

---

## 3. Public Functions

| Function | Auth | Purpose |
|---|---|---|
| `init(admin, config)` | deployer | One-time global config |
| `create_circle(creator, cfg, seed_deposit)` | creator | Deploys/links the circle's DeFindex vault, makes the **mandatory seed deposit** (PRD Q11), records Circle |
| `join(circle_id, member, collateral)` | member | Adds member; locks collateral (CLASSIC/GOAL); PUBLIC_POOL is open-join |
| `contribute(circle_id, member, round, amount)` | member | Pulls `amount` from member → deposits into vault → mints/records member shares; enforces all-paid-before-payout |
| `deposit_public(circle_id, member, amount)` | member | PUBLIC_POOL: open deposit, records member shares. **Enforces `amount >= tier_min`** and, if `cap` set, **`pot_value + amount <= cap`** (else panic — atomic reject, no partial fill) |
| `propose_strategy(circle_id, member, preset)` | member | Opens a vote |
| `vote_strategy(circle_id, member, approve)` | member | Casts vote; auto-resolves at quorum → triggers `rebalance` |
| `payout(circle_id, caller)` | any member (perm-checked) | CLASSIC: rotate full pot to next recipient; advances round |
| `complete_goal(circle_id, caller)` | any member | GOAL: final split when goal/date met |
| `propose_early_exit(circle_id, member)` / `vote_early_exit(...)` | member | GOAL: **unanimous** early withdrawal; applies penalty |
| `change_goal(circle_id, new_label, new_amount, new_date, approvals)` | all members | GOAL: change-once, **unanimous** |
| `withdraw_share(circle_id, member)` | member | PUBLIC_POOL: withdraw **own share only** (`recipient == member` asserted); manager can never route others' shares (§11.1) |
| `handle_default(circle_id, member)` | any member | CLASSIC: slash collateral, make group whole |
| `claim(circle_id, member)` | member | Claim share + accrued yield (settles from vault) |

### Auth pattern
Every member-action does `member.require_auth()`. Because members use OZ Smart Accounts, `require_auth` resolves through the account's `__check_auth` (P256 passkey verification + policy). Lindi Core does not implement signature checks itself.

---

## 4. The Vault-as-Circle Model (core idea)

Each circle owns **one DeFindex vault**. The vault's share token (`dfToken`) **is** the circle's share ledger. Lindi Core stores only *how many of the circle's vault shares belong to each member*.

### 4.1 Creation + mandatory seed (PRD note 8 / Q11)
A DeFindex vault cannot be created empty — the **same transaction** that deploys it must make the first deposit (sets the initial 1:1 share ratio and the strategy allocation ratio).

```
create_circle:
  1. creator.require_auth()
  2. deploy/init DeFindex vault for `preset` (via DeFindex Factory)   // INTEGRATIONS.md
  3. transfer seed_deposit from creator → vault.deposit()            // 1:1 shares minted
  4. record Circle{ vault, ... }, Member{creator, shares = seed}     // creator is first shareholder
```
**Decision (Q11):** the creator's first contribution *is* the seed deposit. Minimum seed enforced in `Config`.

### 4.2 Contribution → shares
```
contribute(amount):
  member.require_auth()
  asset.transfer(member -> core, amount)
  core approves vault; shares_minted = vault.deposit(amount, core_as_holder)
  member.shares  += shares_minted
  pot.vault_shares_total += shares_minted
```
Share formula (DeFindex/standard vault): `shares = amount` if supply 0, else `amount * total_supply / total_assets`. Lindi does not compute this — the **vault returns it**.

### 4.3 Yield accrual
No code path needed. Vault share price rises as strategies earn. A member's USD value = `member.shares * vault.price_per_share()`. The growing-pot UI reads this.

### 4.4 Payout / withdraw / penalty = burn shares
```
withdraw value V for member:
  shares_to_burn = V / price_per_share   (or burn member.shares for full)
  vault.withdraw(shares_to_burn, -> recipient)   // settles to asset
```

---

## 5. Governance → Rebalance

```
vote_strategy(approve):
  member.require_auth()
  vote.votes[member] = approve
  if approvals >= quorum:
     vote.resolved = true
     circle.preset = vote.proposed
     vault.rebalance(target_allocation(vote.proposed))   // Lindi = vault MANAGER
```
`rebalance` is a **manager-gated** DeFindex call. In production the manager authority must be a policy/multisig account (see ARCHITECTURE §3 caveat), not a single key. The Core contract itself can be the manager (contract-as-manager), with rebalance only callable through a resolved vote — preferred, because it removes the off-chain key entirely.

> Allocation targets per preset → `YIELD-ENGINE.md`.

---

## 6. Default Handling (CLASSIC) — the path judges probe

```
handle_default(member m):
  require: circle.mode == ClassicRotating
  require: m.active && contribution overdue (round not paid past round_duration)
  slash = min(m.collateral_locked, shortfall_to_make_group_whole)
  distribute slash across non-defaulting members (as vault shares or asset)
  m.active = false
  emit Defaulted(circle, m, slash)
```
Edge cases to test: defaulter who already `has_received`; defaulter in final round; collateral < shortfall; multiple defaults same round.

### 6.1 Yield-forfeiture (MVP complement — D18)

When collateral is insufficient or as a second backstop, a defaulter **keeps principal but forfeits accrued yield** to the group. Principal is never seized (honesty invariant).

```
on default of member m, after collateral slash:
  principal_m = m.total_contributed
  value_m     = m.shares * price_per_share
  yield_m     = max(0, value_m - principal_m)
  forfeit yield_m → redistribute as shares across non-defaulting members
  m retains shares worth principal_m only
```
**Invariant:** a defaulter's settled value `>= principal_m` (we never take principal) and `<= value_m`. Unit-test alongside §6.

---

## 7. Early Exit & Penalty (GOAL) — unanimous, dynamic, yield-only

PRD D10/D11: early withdrawal needs **all** members' approval; penalty is a **dynamic % of earned yield only**, never principal.

```
propose_early_exit(member): opens exit proposal
vote_early_exit(member, approve):
  record approval
  if ALL active members approved:
     for each member mi:
        principal_i = mi.total_contributed
        value_i     = mi.shares * price_per_share
        yield_i     = max(0, value_i - principal_i)
        pen_rate    = penalty_rate(yield_i)        // dynamic, see YIELD-ENGINE.md
        penalty_i   = yield_i * pen_rate
        payout_i    = value_i - penalty_i
        vault.withdraw(... -> mi) = payout_i
        accrue penalty_i to platform/circle fee receiver
     circle.status = Completed
```
`penalty_rate(yield)` is a decreasing function (default cap 15% for small yields, scaling down for large earners). Defined in `YIELD-ENGINE.md`; passed in / configured, not hardcoded magic.

**Invariant:** `penalty_i <= yield_i` always. Principal is untouchable. Unit-test this.

---

## 8. Change Goal (GOAL) — once, unanimous

```
change_goal(new_label, new_amount, new_date):
  require: !circle.goal_changed
  require: unanimous approval recorded
  circle.goal_* = new_*
  circle.goal_changed = true
```

---

## 9. Classic Payout Ordering

| Order | Logic |
|---|---|
| `ByOrder` | `payout_order` set at creation; index by `current_round` |
| `RandomNoRepeat` | draw from `members \ winners`; on payout push winner → `winners` so they can't be drawn again. Randomness source: PRNG seeded from ledger + circle (MVP); commit-reveal or VRF in prod |
| `Bid` | members submit bids; lowest accepted payout (or highest contribution) wins the round; record fields prepared even if logic is MVP-light |

> MVP may ship `ByOrder` + `RandomNoRepeat` fully and stub `Bid` (fields present).

---

## 10. Events (for the transparent ledger / indexer)

```
CircleCreated(circle_id, mode, creator, vault)
MemberJoined(circle_id, member, collateral)
Contributed(circle_id, member, round, amount, shares_minted)
StrategyProposed(circle_id, preset, by)
StrategyResolved(circle_id, preset)
Rebalanced(circle_id, preset)
PaidOut(circle_id, round, recipient, amount)
GoalCompleted(circle_id, total_yield)
EarlyExit(circle_id, total_penalty)
GoalChanged(circle_id)
Defaulted(circle_id, member, slash)
Claimed(circle_id, member, amount)
Withdrawn(circle_id, member, amount)   // PUBLIC_POOL
```
The mobile ledger view and `ARCHITECTURE.md` read path are built on these.

---

## 11. Security Patterns (Soroban golden standard)

- **Auth on every mutation**: `require_auth` for the acting member; never trust caller-supplied addresses without it.
- **Checks-effects-interactions**: update Lindi storage *before* external vault calls where possible; treat vault calls as the interaction step. Beware reentrancy via token callbacks — Soroban is less prone than EVM but assume hostile assets only if asset is untrusted (MVP asset is testnet USDC SAC, trusted).
- **No integer overflow**: use `checked_*` / `i128`; shares & amounts are `i128`.
- **Invariant asserts**: `penalty <= yield`; `sum(member.shares) == pot.vault_shares_total`; `member.shares >= 0`.
- **Access control**: admin-only config; manager (rebalance) only via resolved vote / contract-as-manager.
- **TTL management**: bump persistent entries for active circles to avoid expiry mid-cycle.
- **Asset allowlist**: only configured deposit asset accepted.
- **Pause switch** (prod): admin emergency pause on new deposits.

### 11.1 Public-Pool Invariants (the trust question — PRD §8.7)

A per-share open pool is safe **only** with these three hard, on-chain guarantees. Judges will probe them.

1. **Custody boundary — withdraw-own-share-only.** `withdraw_share(circle_id, member)` settles **only `Member(circle_id, member).shares`** and `member.require_auth()` is mandatory. The manager (Lindi Core / publisher) authority is scoped to `rebalance` **only** — there is **no code path** by which a manager moves another member's shares to itself. Assert `recipient == member` in the withdraw path.
2. **Share-inflation / first-deposit guard.** The mandatory seed deposit at vault creation (§4.1) plus **locked minimum "dead" shares** (a tiny share amount minted to a burn/zero sink and never withdrawable) prevent a malicious first depositor from skewing `price_per_share` to steal later deposits (the ERC-4626 inflation attack). Verify DeFindex's vault already seeds + locks; if not, Lindi Core seeds and burns the minimum itself.
3. **Round against the depositor.** Share minting on deposit rounds **down** (depositor never gets more shares than value); withdrawals round shares-to-burn **up**. Blocks dust-deposit drain. Combined with the global invariant `Σ member.shares == pot.vault_shares_total + dead_shares`.

> Vulnerability classes & deeper patterns: see the `stellar-dev:soroban` skill reference.

---

## 12. Testing Strategy

| Test type | Targets |
|---|---|
| **Unit** | share math wrappers, penalty bound, round advance, order draw, change-once guard |
| **Integration** (with mock vault) | contribute→deposit→withdraw round-trip; governance→rebalance; default slash |
| **The default path** | every edge in §6 — judges probe this |
| **The penalty path** | `penalty <= yield`, principal intact, unanimous gate |
| **Yield-forfeiture** | defaulter settles `>= principal`, forfeited yield redistributed (§6.1) |
| **Public-pool security** | manager cannot withdraw another's shares; first-deposit inflation blocked; dust-deposit drain blocked; `tier_min` + `cap` reject paths (§11.1) |
| **Fork/differential** (prod) | against real DeFindex vault on testnet |
| **Fuzz/property** | invariants in §11 hold under random op sequences |

Mock the DeFindex vault with a Rust test double implementing `deposit/withdraw/rebalance/price_per_share` so contract tests run without the live protocol.

---

## 13. Build Sequence (mirrors PRD §14.4)

1. **Week 1** — `create_circle`/`join`/`contribute`/`payout` for CLASSIC on testnet USDC, vault-native shares.
2. **Week 2** — GOAL + PUBLIC_POOL branches; collateral/default; unanimous early-exit penalty; tests for default + penalty.
3. **Week 3** — DeFindex vault integration (real deposit/withdraw/rebalance) + governance voting + auto-compound.
4. **Week 4** — frontend wiring; events → ledger UI.

---

## 14. Open Contract Questions

- **Q11** Min seed deposit value in `Config`.
- **Manager model**: contract-as-manager (preferred, keyless) vs external manager key (needs multisig). Recommend contract-as-manager.
- **Randomness for `RandomNoRepeat`**: PRNG (MVP) vs commit-reveal/VRF (prod).
- **PUBLIC_POOL governance** (Q9): publisher-set preset vs open vote.
