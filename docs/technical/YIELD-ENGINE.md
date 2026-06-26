# Lindi — Yield Engine

> Technical companion to `LINDI-PRD.md` §9. Owns preset→strategy allocations, the live-APY pipeline, the projection/calculator math, the dynamic early-exit penalty curve, and the honesty rules in code. All yield comes through DeFindex (`INTEGRATIONS.md` §1). Contract hooks → `SMART-CONTRACTS.md`.

---

## 1. Principle (non-negotiable)

Lindi **does not generate or guarantee yield**. It selects among **existing, audited DeFindex strategies** and displays **live** numbers as ranges. The only "near-fixed" framing allowed is the treasury-backed Conservative preset. (PRD §9.4)

---

## 2. Preset → Strategy Allocation

Allocations are **config, not hardcoded constants** — tunable to whatever strategies are live on the target network.

| Preset | Allocation (illustrative default) | Constituent DeFindex strategies | Character |
|---|---|---|---|
| **Conservative** | 100% treasury | Etherfuse USDC / USTRY | near-fixed floor |
| **Balanced** | 50% / 50% | Etherfuse + Blend Fixed Pool (USDC) | floor + stable variable |
| **Growth** | 20% / 80% | Etherfuse + Blend YieldBlox (USDC) | higher variable |

```ts
// config (basis points)
const PRESET_ALLOC = {
  CONSERVATIVE: [{ strat: ETHERFUSE_USDC, bps: 10000 }],
  BALANCED:     [{ strat: ETHERFUSE_USDC, bps: 5000 }, { strat: BLEND_FIXED_USDC, bps: 5000 }],
  GROWTH:       [{ strat: ETHERFUSE_USDC, bps: 2000 }, { strat: BLEND_YIELDBLOX_USDC, bps: 8000 }],
};
```
A resolved governance vote calls `vault.rebalance(PRESET_ALLOC[preset])` (`SMART-CONTRACTS.md` §5).

> **MVP fallback (Q2):** if multi-strategy vaults are fiddly on testnet, ship **single-strategy vaults** (one per preset = one strategy) and make "preset change" = move funds between single-strategy vaults. Document which path was taken.

---

## 3. Live APY Pipeline

```
DeFindex getVault(strategy/vault) ──▶ raw APY + price/share
        │ (backend, cached TTL ~5 min)
        ▼
blendedAPY(preset) = Σ allocBps_i/10000 × APY_i
        ▼
display: range = [blendedAPY − band, blendedAPY + band]   // band per preset volatility
```
- **Conservative:** narrow band (treasury). May show single near-fixed figure + "tracks US T-bill yields."
- **Balanced / Growth:** **must** show a range/confidence band — never one number (PRD §9.4).
- Observed early-2026 inputs (illustrative only): Etherfuse USTRY ~3.17%; Blend USDC supply ~8%+.

```ts
function blendedAPY(preset: Preset, live: Record<string, number>): number {
  return PRESET_ALLOC[preset].reduce((a, s) => a + (s.bps/10000) * live[s.strat], 0);
}
```

---

## 4. Projection / Yield Calculator (PRD §9.6, §12.4)

Two modes.

### 4.1 Simple (preset mode)
Given `principal`, `monthlyContribution`, `preset`, `months` → project balance curve.
```
balance(t+1) = (balance(t) + monthlyContribution) × (1 + monthlyRate)
monthlyRate  = blendedAPY(preset) / 12        // auto-compound ON
```
For variable presets, compute **low / mid / high** curves using the APY band → the three-line "range" chart. Always render the **floor line** (Conservative-equivalent) distinctly (PRD §9.4 rule 4).

### 4.2 Target mode (the engine that recommends)
Given a `target` (amount or %) + `targetDate` (+ optional `principal`/auto-filled circle value), solve for feasibility and recommend an adjustment:

```
required_rate = solveRate(principal, contribution, months, target)
if required_rate <= blendedAPY(CONSERVATIVE):  → "Conservative reaches it"
elif required_rate <= blendedAPY(BALANCED):    → "Use Balanced (range shown)"
elif required_rate <= blendedAPY(GROWTH):      → "Use Growth (range, no guarantee)"
else: recommend ONE OR MORE of:
   • add initial modal  Δprincipal = solvePrincipal(...)
   • extend timeline    Δmonths   = solveMonths(...)
   • raise contribution Δcontrib  = solveContribution(...)
```
Output = a human recommendation, e.g. *"To hit Rp60jt for Umroh by next Lebaran: add Rp2jt modal **or** extend 2 months **or** switch to Balanced (projected 10–12 months)."* Always honest, always ranged for variable presets.

> The solver is plain TVM/annuity math (future value of a series). Keep it in the backend projection service; the contract is not involved.

---

## 5. Dynamic Early-Exit Penalty Curve (PRD §8.10 / D11)

Penalty is a **% of earned yield only**, default **15%**, **scaling down** for members who earned a lot (so big earners aren't disproportionately punished). Principal never touched.

### 5.1 Requirements
- `penalty(yield) = rate(yield) × yield`, with `rate(0)=0..15%`, `rate` **non-increasing** in yield, `penalty ≤ yield` always.
- Smooth, predictable, explainable to a user.

### 5.2 Recommended form (tiered or smooth decay)
**Option A — smooth decay** (recommended):
```
rate(y) = rate_min + (rate_max − rate_min) × (k / (k + y))
   rate_max = 0.15   // small earners
   rate_min = 0.03   // floor for very large earners
   k        = scale constant (e.g. 50 USDC of yield)
penalty = rate(y) × y
```
As `y → 0`, `rate → 15%`. As `y → ∞`, `rate → 3%`. Always `penalty ≤ y`.

**Option B — tiered** (simpler to explain):
| Earned yield | Penalty rate |
|---|---|
| ≤ $20 | 15% |
| $20–$100 | 10% |
| $100–$500 | 6% |
| > $500 | 3% |

```ts
function penaltyRate(yieldUsd: number): number { // Option A
  const RATE_MAX = 0.15, RATE_MIN = 0.03, K = 50;
  return RATE_MIN + (RATE_MAX - RATE_MIN) * (K / (K + Math.max(0, yieldUsd)));
}
```
Parameters (`rate_max/min`, `k`, or tier breakpoints) are **config** (PRD Q10). The contract enforces only the invariant `penalty ≤ yield`; the rate function value is computed and passed/validated.

### 5.3 Worked example
Member contributed $100, vault value now $112 → yield $12. `rate(12) = 0.03 + 0.12×(50/62) ≈ 0.127`. Penalty ≈ $1.52. Payout = $112 − $1.52 = $110.48. Principal ($100) fully intact. ✅

---

## 6. Auto-Compound Toggle (PRD §8.8)

| Toggle | Behavior |
|---|---|
| **ON** (default) | Yield stays in vault (Etherfuse autocompounds natively; Blend yield re-deployed). Projection uses compounding `monthlyRate`. |
| **OFF** | Periodically realize yield to a claimable balance (withdraw the *yield portion* of shares to asset, mark claimable). Projection uses simple (non-compounding) accrual. |

OFF is heavier (extra withdraws) → consider per-cycle realization, not continuous.

---

## 7. USD-Protection Comparison (PRD §2.1, §9.4 rule 6)

Always frame vs local instruments in **USD purchasing-power terms** with the depreciation assumption explicit.
```
realReturnUSD(localNominal) = localNominal − assumedIdrDepreciation   // e.g. 2.9%/yr
lindiAdvantage = blendedAPY(preset) − realReturnUSD(deposito)
display: "stated assumption: IDR ~2.9%/yr depreciation (10-yr trend); not a prediction"
```
Never assert future depreciation; label as protection against a documented trend.

---

## 8. Honesty Rules in Code (enforce, don't trust copy)

- A render guard: variable presets (Balanced/Growth) **cannot** be rendered with a single APY number — the component requires a `{low, mid, high}` triple.
- Conservative is the only preset allowed a single-figure "near-fixed" label.
- All displayed APYs carry a `source: "live"` timestamp; stale (> TTL) → show "updating…", never a guess.
- The projection floor line is always drawn for variable presets.

---

## 9. Open Yield Questions

- **Q2** Multi-strategy vault vs single-strategy-per-preset for MVP.
- **Q7** Lindi `vaultFeeBps` (fee on yield, ≤9000).
- **Q8** Exact preset allocation percentages (tune with live testnet rates).
- **Q10** Penalty curve params (Option A constants or Option B tiers).
- **Bands:** per-preset volatility band width for the range display.
