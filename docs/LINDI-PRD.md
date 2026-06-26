# LINDI — Product Requirements Document (PRD)

> **The arisan Indonesians trust, now protecting their savings from a weakening rupiah.**
> A group savings platform on Stellar that turns the world's oldest savings ritual into USD-protected, yield-bearing financial inclusion — with no bank, no seed phrase, and no crypto knowledge required.

---

| | |
|---|---|
| **Product Name** | Lindi |
| **Document Type** | Product Requirements Document (Enterprise-grade) |
| **Version** | 2.0 |
| **Status** | Anchor document — product source of truth. Technical detail lives in `docs/technical/`. |
| **Target Event** | APAC Stellar Hackathon 2026 (Track 1: Local Finance & Real-World Access, positioned to also satisfy Track 2: DeFi & Composability) |
| **Prize Target** | Up to $60,000 USD + post-hackathon SCF Build Award |
| **Network (MVP)** | Stellar Testnet |
| **Author** | Product & Strategy |
| **Last Updated** | June 2026 |

> **Document split (v2.0):** This PRD is the **product bible** — it owns the *what* and the *why*. Implementation detail (contracts, integrations, data model, yield-engine mechanics) lives in `docs/technical/`. When build reality diverges from this document, **update this document** — it stays the source of truth.
>
> Companion technical docs:
> - `technical/ARCHITECTURE.md` — system layers & data flow
> - `technical/SMART-CONTRACTS.md` — Lindi Core contract, functions, vault-as-circle model
> - `technical/INTEGRATIONS.md` — DeFindex, OpenZeppelin Relayer + Channels, smart-account-kit, OZ stellar-contracts, Soroswap
> - `technical/YIELD-ENGINE.md` — presets → DeFindex strategies, live-data, honesty model
> - `technical/DATA-MODEL.md` — entities, shares (dfTokens), vault mapping

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Business Context & Market Opportunity](#2-business-context--market-opportunity)
3. [The Problem](#3-the-problem)
4. [The Solution & Unique Value Proposition](#4-the-solution--unique-value-proposition)
5. [Competitive Landscape & The Stellar Winner Pattern](#5-competitive-landscape--the-stellar-winner-pattern)
6. [Target Users & Personas](#6-target-users--personas)
7. [Product Principles](#7-product-principles)
8. [Core Concepts & Mechanics](#8-core-concepts--mechanics)
9. [The Yield Engine — Presets, DeFindex & Honesty Model](#9-the-yield-engine--presets-defindex--honesty-model)
10. [How Lindi Composes Stellar (Product View)](#10-how-lindi-composes-stellar-product-view)
11. [Stellar Ecosystem Integration Map](#11-stellar-ecosystem-integration-map)
12. [Feature Specifications](#12-feature-specifications)
13. [User Flows](#13-user-flows)
14. [MVP Scope (Hackathon / Testnet)](#14-mvp-scope-hackathon--testnet)
15. [Production Scope (Post-Hackathon)](#15-production-scope-post-hackathon)
16. [Business Model & Revenue](#16-business-model--revenue)
17. [Demo Strategy & Pitch Narrative](#17-demo-strategy--pitch-narrative)
18. [Risks, Constraints & Mitigations](#18-risks-constraints--mitigations)
19. [Success Metrics](#19-success-metrics)
20. [Roadmap](#20-roadmap)
21. [Brainstorm Section — Suggested Features](#21-brainstorm-section--suggested-features)
22. [Open Questions & Decisions Log](#22-open-questions--decisions-log)
23. [Glossary](#23-glossary)

---

## 1. Executive Summary

### 1.1 What Lindi Is

Lindi is a **group savings platform built on Stellar** that wraps the deeply-trusted Indonesian ritual of **arisan** (rotating savings circles) around a modern, USD-protected, yield-bearing engine. Members save together — in the classic rotating format everyone already knows, toward a shared long-term goal, or in an open public pool — and while their pooled money waits, it earns yield through audited Stellar DeFi, protecting it from the rupiah's long-term decline.

The user never sees a seed phrase, never buys XLM, and never needs to understand blockchain. They experience a friendly mobile savings app. Underneath, Lindi composes the best of the Stellar ecosystem through a single primary integration — **DeFindex** — which routes pooled savings into audited yield strategies (Blend lending pools and Etherfuse tokenized-treasury Stablebonds), while:

- **smart-account-kit** (OpenZeppelin Smart Accounts) gives every user an invisible biometric (passkey / P256) smart wallet.
- **OpenZeppelin `stellar-contracts`** provides the audited on-chain account-abstraction logic that validates those biometric signatures and enforces access policies.
- **OpenZeppelin Relayer + relayer-plugin-channels** sponsors gas (gasless UX), parallelizes transaction submission, and handles retries / fee-bumps / confirmations.
- **DeFindex** is the yield hero — one integration that exposes Blend (variable) and Etherfuse treasury Stablebonds (near-fixed floor) as one-click, autocompounding vault strategies.
- **Soroswap** is used only as a swap utility when an asset conversion is required (low priority).

### 1.2 Why It Wins

Lindi is engineered to score on all four hackathon-winning dimensions simultaneously:

- **Win odds** — It occupies the least-crowded *strong* angle (local finance + real-world access), composes proven primitives (Blend via DeFindex) instead of reinventing them, and sits dead-center on the Stellar Development Foundation's #1 stated 2026 priority: real-world asset adoption and cross-border/local-economy utility.
- **Real startup** — Rotating savings is a **global primitive** (arisan in Indonesia, *paluwagan* in the Philippines, *tanda* in Mexico, *chama* in Kenya, *susu* in Ghana, *hui* in Chinese communities) used by hundreds of millions of people in exactly the emerging markets Stellar targets. The currency-protection thesis is a real, durable, fundable wedge.
- **Novelty** — Plain on-chain ROSCA is an over-cloned pattern. Lindi's novel mechanism is **collective, on-chain governance of a savings group's yield strategy** (the group's vote literally rebalances its own DeFindex vault) combined with **USD-protection disguised as familiar savings** — neither has shipped on Stellar.
- **Clean demo** — One engine, multiple modes. The familiar rotating mode earns instant recognition; the goal-based mode delivers the "blockchain unlocks this" climax with a visible, growing, currency-protected balance.

### 1.3 The One-Sentence Pitch

> *"Indonesian families have lost a third of their savings' real value to the weakening rupiah over the past decade. Lindi gives them a savings circle that feels exactly like the arisan they already trust — but quietly protects their money in USD-denominated yield, so they stop bleeding purchasing power. No bank, no seed phrase, no crypto knowledge needed."*

### 1.4 Strategic Pillars

1. **Familiarity as the entry, substance as the depth.** Arisan gets people in the door; USD-protected long-term yield is what makes staying worthwhile.
2. **Invisible crypto.** Biometric smart accounts + sponsored gas mean the target user never confronts a wallet, a seed phrase, or a gas fee.
3. **Radical honesty about yield.** No fantasy APYs. Treasury/stablecoin floor + transparent variable upside, always shown as ranges pulled from live on-chain data, never as guarantees.
4. **Compose, don't reinvent.** Lindi is an application layer that orchestrates proven Stellar primitives — principally DeFindex — the exact behavior SCF judges reward.
5. **Local hero, global TAM.** Built deeply for Indonesia; demonstrably a universal primitive everywhere else.

---

## 2. Business Context & Market Opportunity

### 2.1 The Macro Wound: Rupiah Depreciation

The foundational insight behind Lindi is quantified and durable. Over the last ~10 years, the Indonesian rupiah has depreciated against the US dollar from roughly IDR 13,400/USD (2016) to roughly IDR 17,800/USD (mid-2026) — a **~33% loss of value, averaging ~2.9% per year, every year**, and accelerating recently (the USD/IDR pair moved ~9% in a single recent year, with Bank Indonesia hiking rates 50bps specifically to defend the currency as it hit record lows).

This creates a silent tax on every rupiah-denominated saver. When measured in **USD purchasing-power terms**, the "safe" Indonesian savings instruments look very different from their headline rates:

| Instrument | Nominal Yield (IDR) | Real Return in USD Terms (after ~2.9%/yr depreciation) |
|---|---|---|
| ORI / Obligasi Ritel (govt retail bond) | ~6.5% | **~3.6%** |
| Reksadana Pasar Uang (money market fund) | ~4.5% | **~1.6%** |
| Deposito (bank time deposit) | ~3.5% | **~0.6%** |
| **Lindi Conservative preset** | — | **~3–4% (treasury floor, live)** |
| **Lindi Balanced preset** | — | **~5–6% (floor + variable, live range)** |
| **Lindi Growth preset** | — | **~7–9% (higher variable, live range)** |

> **Honesty note on Lindi rows:** Lindi never prints a fixed promised APY. Preset returns are **pulled live from the underlying DeFindex strategies** and shown as ranges. The percentages above are **illustrative, sourced from early-2026 observed rates** (Etherfuse USTRY ~3.17% APY; Blend USDC supply ~8%+ APY) — the in-app numbers always reflect current on-chain rates, never these placeholders. See §9.

> **The punchline:** An Indonesian saver *thinks* they earn 6.5% on ORI, but in real global-purchasing-power terms they earn ~3.6% because the rupiah quietly bleeds value. A USD-denominated savings product carries no such drag — and in IDR-equivalent terms, a 6% USD yield effectively becomes ~8.9%/year for an Indonesian, because they capture both the yield *and* the currency appreciation.

**Honesty guardrail:** This advantage assumes the rupiah continues its historical depreciation trend. If Bank Indonesia's defense succeeds and the rupiah stabilizes, the USD advantage narrows toward the raw yield differential. Lindi never *predicts* future depreciation — it frames USD exposure as protection against a decade-long, well-documented trend.

### 2.2 The Cultural Substrate: Arisan at Scale

Arisan is not a niche behavior — it is woven into Indonesian social and financial life. Millions of Indonesians participate in rotating savings circles, organized among neighbors, families, office colleagues, and religious communities. The ritual is trusted, habitual, and socially enforced. Crucially, the same primitive exists across virtually every emerging market under different names, representing a combined addressable population in the hundreds of millions.

### 2.3 The Regulatory Tailwind: OJK Tokenization Framework (Q3 2026)

Indonesia's financial regulator (OJK) is finalizing a digital/RWA asset-tokenization framework expected in **Q3 2026** — precisely as this hackathon concludes. OJK is additionally exploring a regulated rupiah stablecoin within a regulatory sandbox. This timing lets Lindi credibly position itself as **"built for the regulation arriving in 90 days,"** turning a future compliance pathway into a present-day narrative advantage.

> **Scope note:** Lindi is deliberately structured to live in the space *enabled* by tokenization without requiring Lindi itself to become a licensed bank or securities issuer. It is a consumer application that *composes* existing tokenized assets (via DeFindex) — it does not issue securities or take deposits in the regulated sense. (See §18.)

### 2.4 Market Scope

- **Hero market:** Indonesia. Deep, specific, culturally authentic — the moat no foreign team can replicate.
- **Growth evidence:** Multi-market emerging economies (Philippines/*paluwagan*, Mexico/*tanda*, Kenya/*chama*, West Africa/*susu*). Notably, DeFindex already exposes **local treasury Stablebonds beyond the US** — CETES (Mexico) and TESOURO (Brazil) — meaning the multi-currency-floor story has real on-chain backing, not just a roadmap claim.

---

## 3. The Problem

### 3.1 Problem Statement

Indonesian households who save through arisan and traditional instruments face three compounding problems that no existing product solves together:

**Problem 1 — Idle money loses value.**
In a rotating arisan, the pooled pot sits idle (in a biscuit tin or a non-interest-bearing account) until it is paid out. In long-term goal saving (for Lebaran, umroh, school fees, modal usaha), money sits for *months* earning nothing — while inflation and rupiah depreciation silently erode it. Over a multi-month cycle, this is real, measurable lost value.

**Problem 2 — Trust is centralized in one fragile point.**
The arisan *bendahara* (treasurer) physically holds everyone's cash. If they have an emergency, mismanage funds, or simply make an error, the entire group's savings and social trust are at risk. There is no transparency into who has paid, whose turn is next, or where the money actually is.

**Problem 3 — The "safe" alternatives quietly underperform.**
Indonesians who *do* graduate to formal instruments (deposito, reksadana, ORI) still bleed purchasing power to currency depreciation (§2.1). USD-denominated instruments would protect them — but those feel foreign, inaccessible, and intimidating to a mainstream saver, and the on-ramp to access them is effectively closed to the mass market.

### 3.2 Why This Hasn't Been Solved

- **Pure fintech savings apps** don't address currency protection and don't have the social retention mechanism that makes saving stick.
- **Crypto/DeFi products** that *could* offer USD yield are unusable by the target demographic — seed phrases, gas fees, wallet complexity, and volatility terminology are insurmountable barriers.
- **Traditional gold/USD savings** (Pegadaian, Pluang) offer protection but lack the social arisan mechanic, the composable yield layer, and global portability.
- **Nobody has built the bridge** between the trusted social ritual (arisan) and the protective financial engine (USD-denominated yield), wrapped in an interface that hides all blockchain complexity.

### 3.3 The "Open Once a Month" Risk (Acknowledged)

A naive arisan app is opened only at payout time — terrible retention, and yield is trivial because money barely sits. Lindi explicitly designs against this: it reframes the product from "an arisan app" to "group savings that happens to include arisan," targets long-cycle goal groups and public pools where yield is meaningful, and uses the continuously-growing pot balance as the weekly re-engagement hook. (See §7 and §12.)

---

## 4. The Solution & Unique Value Proposition

### 4.1 Solution Overview

Lindi is a mobile-first group savings platform with **one engine and three savings modes**:

- **Classic Rotating Mode** — the familiar arisan: members contribute each round, the full pot rotates to one member per round (by order, random-no-repeat draw, or bid). Money sits briefly; yield is a small bonus; the value is trust, transparency, and automation.
- **Goal-Based Collective Mode** — members save toward a shared, custom-labelled goal (e.g. "Umroh", "Marriage") with an optional target date; no one takes the pot mid-cycle; funds stay invested for months. Money sits long; yield is real and meaningful; this is where USD-protection shines.
- **Public Pool Mode** *(new)* — a circle can be **published publicly**; anyone can join and deposit their own share without the rotating/group-turn mechanic. It behaves like an open, social USD-yield savings pool on top of the same vault engine. (See §8.7.)

In every mode, the idle pot lives in a **per-circle DeFindex vault** whose strategy is chosen by a **group-voted risk preset** (Conservative / Balanced / Growth). The vote literally rebalances the circle's vault. Onboarding is via biometric smart accounts with sponsored gas — invisible crypto.

### 4.2 Unique Value Proposition (UVP)

> **Lindi is the only savings product that combines the social trust of arisan, the purchasing-power protection of USD-denominated yield, and an interface so simple the user never knows a blockchain is involved.**

Decomposed:

| Layer | What competitors offer | What Lindi uniquely offers |
|---|---|---|
| **Social** | Solo savings apps (no accountability) | Group arisan circles + public pools with built-in social retention |
| **Protection** | Rupiah instruments that bleed to depreciation | USD-denominated, treasury/stablecoin-backed yield floor |
| **Yield** | Fixed low rates OR fantasy APYs | Honest live floor + transparent variable upside, shown as ranges |
| **UX** | Seed phrases, gas, volatility jargon | Biometric login, sponsored gas, zero crypto exposure |
| **Governance** | Opaque or admin-controlled | Group votes its own risk strategy on-chain → rebalances its own vault |
| **Reach** | Local-only or crypto-native-only | Global ROSCA primitive, locally trusted |

### 4.3 The Three Things That Make Lindi Defensible

1. **The currency-protection thesis** — data-backed, emotionally real, and impossible for a foreign team to conceive or pitch authentically.
2. **The group-governance mechanic** — collective on-chain voting that rebalances a real DeFindex vault is genuinely novel on Stellar.
3. **The invisible-crypto onboarding** — biometric smart accounts + sponsored gas turn an un-usable demographic into an addressable one; this is a live demo moment, not a claim.

---

## 5. Competitive Landscape & The Stellar Winner Pattern

### 5.1 The Pattern Among Stellar Hackathon & SCF Winners

Analysis of recent Stellar winners (Philippines hackathon, Consensus Cash-to-DeFi track, and SCF-funded consumer apps) reveals a consistent, repeatable formula:

> **[Specific underserved user] + [specific local financial pain] + [a Stellar primitive: anchor / stablecoin / Soroban] + [Web2-grade UX that hides the chain].**

Winners never lead with technology. They lead with a person who has a money problem. Concrete examples of the pattern:

- **Sobre** (PH, Best Use of Stellar) — a *digital envelope budgeting* layer on OFW remittances. Not "a remittance app" — a specific UX wedge on top of remittance.
- **TyFi** (PH, Best Use of Stellar) — instant disaster-relief finance + credit for *agricultural workers*. Hyper-specific beneficiary, solo founder.
- **DeFindex** (Consensus winner → real product) — one-click diversified DeFi savings for wallet providers. A composability/abstraction play — and Lindi's primary integration.
- **Freelii** (Consensus → SCF-funded) — a remittance *chatbot* on Telegram + Stellar Anchors. Pivoted to broaden appeal — and that pivot helped it win more.
- **Beans / Meru** — consumer-friendly front-ends that integrate **Blend** for yield underneath. The "consumer UX on a DeFi primitive" pattern that SDF repeatedly rewards.

### 5.2 The Consumer-on-DeFi Meta (Lindi's Template)

Almost every consumer success on Stellar is a friendly front-end hiding a DeFi primitive: **Beans + Blend, Meru + Blend, DeFindex + Blend.** SDF's own flywheel thesis states it: more DeFi protocols drive more Soroban invocations; more consumer apps drive more stablecoin/payment volume. The winning move is rarely "build a new protocol" — it is **"build the consumer app that drives volume *through* an existing protocol."**

**Lindi is this meta, executed precisely:** a consumer arisan app (Track 1 + real users, real UX) that drives volume *through* DeFindex (which itself composes Blend + Etherfuse) — composability (Track 2) — aimed at a local real-world-access pain (Track 1 — the explicit hero track).

### 5.3 How Lindi Matches the Winner Pattern

| Winner-pattern element | Lindi's instantiation |
|---|---|
| Specific underserved user | Aspiring-middle Indonesian goal-savers in arisan groups |
| Specific local pain | Idle savings bleeding to rupiah depreciation; centralized arisan trust risk |
| Stellar primitive | Soroban contracts + DeFindex (→ Blend + Etherfuse Stablebonds) + smart-account-kit + OZ Relayer/Channels |
| Web2-grade UX hiding the chain | Biometric onboarding, sponsored gas, growing-balance UI, zero crypto jargon |
| Composability (SDF reward) | Orchestrates DeFindex + the ecosystem under it, rather than reinventing |
| "What happens after" (SCF 7.0 scoring) | Clear production roadmap + real-anchor partnership + multi-market TAM |

### 5.4 Direct & Indirect Competitors

| Competitor | Category | Why Lindi differentiates |
|---|---|---|
| **Pluang / Pintu (digital gold/USD)** | Local fintech | No social arisan mechanic, no group governance, no composable yield, not arisan-native |
| **Traditional arisan (offline)** | Incumbent behavior | No yield, centralized trust, no transparency, no portability |
| **GoodGhosting / Esusu (other-chain ROSCA dApps)** | Crypto ROSCA | Died on gas costs; no treasury floor; no invisible onboarding; not localized to Indonesia; no currency-protection thesis |
| **Bank savings / deposito** | Traditional | Bleeds to depreciation; no social mechanic; low engagement |
| **Beans / Meru (Stellar consumer + Blend)** | Same Stellar meta | Not arisan/group-native; not Indonesia-focused; no currency-protection framing or group governance |

### 5.5 Competitive Moat Summary

Lindi's moat is the **intersection** — not any single feature. Each competitor solves one layer; only Lindi unifies social trust + currency protection + honest composable yield + invisible UX + group governance, localized to Indonesia with global TAM.

---

## 6. Target Users & Personas

### 6.1 Primary Persona — "Bu Sri" (The Arisan Organizer)

| Attribute | Detail |
|---|---|
| **Age / role** | 38, runs a neighborhood (RT/RW) arisan of 10 members |
| **Income** | Aspiring-middle; household income meaningful but not affluent |
| **Tech comfort** | High WhatsApp fluency; low-to-zero crypto knowledge; lives on her phone |
| **Current behavior** | Collects cash monthly, tracks turns in a notebook/WhatsApp, holds the pot personally |
| **Goals** | Lebaran fund, children's school fees, modal usaha; wants the group's money to be safe and to grow |
| **Pains** | Stress of holding everyone's cash; disputes over who paid; money losing value; no growth |
| **Why Lindi** | Removes the trust burden, automates turns, makes the pot grow, all in a familiar interface |

### 6.2 Secondary Persona — "Andi & Maya" (Young Couple, Long-Term Goal)

| Attribute | Detail |
|---|---|
| **Age / role** | Late 20s couple saving for umroh / a house down payment |
| **Income** | Dual-income, financially curious, frustrated by deposito returns |
| **Tech comfort** | Medium-high; have heard of crypto but find it intimidating/risky |
| **Current behavior** | Joint savings account earning ~3%; aware inflation eats it |
| **Goals** | Hit a specific target (e.g., Rp60jt) by a specific date, under a label that means something ("Umroh") |
| **Pains** | Returns too low; rupiah depreciation; no clear projection to their goal |
| **Why Lindi** | Goal-based mode with USD-protected yield + a calculator that shows exactly when they'll hit the target |

### 6.3 Tertiary Persona — "Pak Budi" (The Skeptical Saver)

| Attribute | Detail |
|---|---|
| **Profile** | 50s, risk-averse, distrusts anything that sounds like "investment scheme" or high-APY crypto |
| **Why he matters** | Represents the mass-market trust barrier; Lindi's *honesty* model is designed to convert him |
| **Why Lindi** | "We don't promise 100% APY — we give a treasury/stablecoin-backed floor plus transparent variable upside, beating deposito and reksadana, protected from the rupiah." |

### 6.4 The Judge (Demo Audience)

A distinct "user" for the hackathon: SDF-aligned judges scoring real utility, composability, local relevance, and post-hackathon viability. The product and demo are explicitly designed to satisfy their scoring rubric (see §17).

---

## 7. Product Principles

These principles govern every design and scoping decision. When in doubt, defer to these.

1. **Invisible crypto, always.** No seed phrases, no gas prompts, no volatility jargon in the primary flow. If a feature forces crypto complexity onto the user, it is redesigned or cut.
2. **Honesty as a feature.** Never display a guaranteed return for a variable strategy. Always show ranges and confidence, pulled from live on-chain data. The Conservative (treasury/stablecoin-backed) preset is the only "near-fixed" framing, and it is labeled precisely.
3. **Familiar first, novel underneath.** The surface must feel like arisan/a savings app. Innovation lives in the engine, not in unfamiliar UI metaphors.
4. **Social retention over feature bloat.** The group is the retention mechanism. Lean into visibility, gentle nudges, and shared goals before adding standalone features.
5. **Compose, don't reinvent — DeFindex first.** Lindi primarily interacts with **DeFindex** and the ecosystem *inside* it (Blend, Etherfuse Stablebonds, Soroswap as a swap utility). We use what is audited and available; we only build what is genuinely missing (the group / governance / identity / UX layer). We do **not** write custom yield strategies for the hackathon — that is a separate, audited, Soroban strategy-development effort and is out of scope (see §9.7).
6. **Scope discipline wins hackathons.** A working simple version beats a broken ambitious one. Ambitious items are framed as roadmap, not half-built.
7. **Demo-driven development.** Every MVP feature must contribute to the 3-minute demo narrative or it is deprioritized.

---

## 8. Core Concepts & Mechanics

### 8.1 The Circle (Core Unit)

A **Circle** is a savings group — the fundamental object in Lindi. Every Circle has:

- A **mode**: `CLASSIC_ROTATING`, `GOAL_BASED`, or `PUBLIC_POOL`
- **Members** (identified by a **unique username**, mapped to a smart-account address — see §8.6)
- A **contribution schedule** (amount, frequency, number of rounds) — except `PUBLIC_POOL`, which is open-deposit
- A **yield preset** (group-voted: Conservative / Balanced / Growth)
- A **dedicated DeFindex vault** (the circle's pot lives here; the vault *is* the share ledger — see §8.5)
- An **auto-compound toggle** (reinvest yield vs keep yield claimable — see §8.8)
- A **goal** (for `GOAL_BASED`: a custom label, target amount, and/or target date)

### 8.2 One Engine, Three Modes

All modes share ~90% of the contract machinery. The **only** structural differences are the **payout rule** and whether membership is closed (invite) or open (public).

| | Classic Rotating | Goal-Based Collective | Public Pool |
|---|---|---|---|
| **Membership** | Closed (invite) | Closed (invite) | Open (published) |
| **Payout rule** | Each round, full pot → one member (order / random-no-repeat / bid) | No mid-cycle payout; distributed at goal completion; unanimous early-exit allowed with penalty | Each member withdraws their own share anytime |
| **Money sits** | Days | Months | Member-defined |
| **Yield role** | Small bonus | Real and meaningful | Real and meaningful |
| **Hook** | Familiarity ("this is arisan") | Financial inclusion ("what a biscuit tin never could") | Open social USD-savings pool |
| **Demo role** | Opener (instant recognition) | Climax (the yield reveal) | "And anyone can join one" coda |

In code: a single `mode` enum and branches in the join / distribution functions. One contract, one audit, one codebase. (Contract detail → `technical/SMART-CONTRACTS.md`.)

### 8.3 Group Governance — The Novel Mechanic

The differentiating feature: members **discuss and vote** on the Circle's yield preset. Because each Circle owns a dedicated DeFindex vault and Lindi acts as that vault's **manager**, a resolved vote translates into a real **vault rebalance** — the group literally moves its own money between strategies.

- The vote is **at the group level** — the whole pot follows one preset per cycle. (Per-member strategies are explicitly rejected: they explode accounting and break rotating-pot logic.)
- Voting is on-chain, transparent, and quorum/majority-based.
- This makes the calculator, presets, goal, and group voting **one unified mechanic** rather than four separate features.

### 8.4 The Dropout / Default Problem (The Genuinely Hard Part)

What separates Lindi from a ROSCA clone is handling the case where a member who already received the pot (Classic mode) stops contributing. Defenses, in order of MVP priority:

1. **Collateral staking (MVP)** — members lock a deposit on join; defaulting forfeits it to the group. Simplest, most demoable.
2. **Risk-ordered positioning (Production)** — earlier (more default-tempting) payout positions post more collateral or accept a small fee; later positions earn a yield premium for waiting.
3. **Reputation (Production)** — on-chain completion history gates entry to future/larger circles.

### 8.5 Contribution & Share Accounting (Vault-Native)

Lindi does **not** hand-roll proportional-yield math. Each Circle's pot is held in a **dedicated DeFindex vault**; the vault itself is the share ledger (its vault shares, "dfTokens", track each depositor's claim, and their value rises as yield accrues — non-rebasing).

- Each member's contributions mint vault shares proportional to value deposited at that moment (first deposit is 1:1; later deposits use the standard vault-share formula). Lindi's contract tracks per-member share balances.
- Accrued yield is distributed **automatically** by the rising share price — no separate distribution accounting needed.
- Payout / withdrawal / penalty = burning the relevant shares and settling to the deposit asset.

> Detailed vault-share mechanics, the mandatory seed deposit at vault creation, and the share formula live in `technical/DATA-MODEL.md` and `technical/SMART-CONTRACTS.md`.

### 8.6 Identity — Username, not Wallet Address

Asking a mainstream user for a wallet address breaks the "invisible crypto" principle. Instead:

- Each user picks a **unique username** (one per person) at onboarding.
- The username maps to their smart-account address under the hood.
- Inviting someone to a circle, sending, or referencing a member is always done by **username** (or phone contact), never by a raw address.

### 8.7 Public Pool Mode (New)

A circle can be **published publicly**. Unlike closed circles, a public pool:

- Lets **anyone discover and join** it (no invite, no rotating turn order).
- Each participant **deposits their own share** and **withdraws their own share** independently — there is no group payout turn and no all-paid-before-payout enforcement.
- Still runs on the same **per-circle DeFindex vault + group preset** engine, so deposits earn the same USD-protected yield.
- Is ideal for community organizers, cooperatives, or influencers who want to offer an open, transparent USD-savings pool to a wide audience.

> Public Pool is governance-light by default (the publisher sets the preset; optionally opens it to vote). Exact governance options for public pools are an open design item — see §22.

### 8.8 Auto-Compound Toggle

Each circle (or member, in Public Pool) has an **auto-compound** setting:

- **On (default):** yield stays in the vault and compounds (Etherfuse strategies autocompound natively; Blend yield is re-deployed). Maximizes long-term growth.
- **Off:** accrued yield is periodically made **claimable/spendable** rather than reinvested — useful for members who want a "payout drip" feeling.

### 8.9 Goals — Custom Label, Amount, Date

For `GOAL_BASED` circles, members set:

- A **custom label** they type themselves — e.g. "Umroh", "Marriage", "Modal Usaha", "Lebaran".
- A **target amount** and/or a **target date**.
- The goal can be **changed once** during the circle's life, and the change requires **unanimous member approval** (§8.10).

### 8.10 Early Exit & Penalties (Goal-Based)

Goal-Based circles are meant to stay invested to completion, but real life intervenes. Rules:

- **Early withdrawal requires unanimous agreement** of all circle members. (Decision D10.)
- When an early withdrawal is executed, an **early-exit penalty** is applied: **a percentage of the *earned yield only*** (never the principal). Default **15%**, but **dynamic** — the percentage **scales down for members who earned a large amount of yield**, so high earners are not disproportionately punished. (Exact dynamic curve → `technical/YIELD-ENGINE.md`; an open tuning item, §22.)
- The penalty taken is retained by the circle / platform per the revenue model (§16); it is **never** taken from a member's deposited principal.
- **Changing the goal** (label / amount / date) is allowed **once**, and also requires **unanimous** member approval.

---

## 9. The Yield Engine — Presets, DeFindex & Honesty Model

This section is foundational. Lindi's credibility — with both users and judges — depends on getting the yield story honest and precise. **All yield comes through DeFindex**; Lindi does not generate or guarantee yield itself.

### 9.1 What DeFindex Gives Lindi

DeFindex is a vault-routing protocol: pooled funds are deposited into a **vault**, the vault allocates into one or more audited **strategies**, and the vault share ("dfToken") rises in value as yield accrues. Lindi integrates DeFindex as a vault **integrator** (via its TypeScript SDK / API), which means:

- Lindi is limited to **strategies DeFindex has already built and audited** — it cannot invent new pools on the fly. This is a deliberate security boundary, and it is fine: the existing strategies already cover everything Lindi needs.
- Writing a brand-new strategy (e.g. an Aqua/Phoenix LP strategy) is a separate Rust/Soroban + audit effort — **out of scope** (§9.7).

### 9.2 The Yield Sources Lindi Composes (via DeFindex)

Confirmed DeFindex strategy families and the role each plays in Lindi:

| Strategy family (DeFindex) | Underlying | Assets | Observed APY (early 2026)* | Yield profile | Role in Lindi |
|---|---|---|---|---|---|
| **Etherfuse Pool** | Etherfuse Stablebonds (tokenized treasuries; autocompounding; non-rebasing) | USDC, **USTRY** (US), **CETES** (MX), **TESOURO** (BR) | USTRY ~3.17% | near-fixed, treasury-backed | The **floor** — Conservative anchor; multi-currency floor for the global story |
| **Fixed Pool** | Blend Fixed Pool V2 (immutable params) | USDC, EURC, XLM | USDC ~6–8% | variable but stable | The **stable variable** middle |
| **YieldBlox Pool** | Blend YieldBlox V2 (+ BLND rewards) | USDC, XLM | USDC ~8%+ | higher variable | The **growth upside** |

> *APYs are **observed snapshots**, not promises. They fluctuate; the app always shows the **current live rate** from DeFindex. Etherfuse/treasury rates track US T-bill yields; Blend rates track pool utilization. **Never** display these as fixed.

Deposit/accounting asset for Lindi circles is **USDC** (it does not have to be a treasury Stablebond — see §9.5). Soroswap is used only if a swap is needed to settle into the deposit asset.

> Live strategy addresses and per-strategy detail → `technical/INTEGRATIONS.md`.

### 9.3 The Three Presets

Each preset is a point on the safety ↔ return spectrum, mapped to DeFindex strategies. The group votes which one governs the Circle; the vote rebalances the circle's vault.

| Preset | DeFindex allocation (illustrative) | Blended APY (early-2026 illustrative)* | Profile | Honest claim |
|---|---|---|---|---|
| **Conservative** | ~100% Etherfuse (USTRY/USDC treasury) | ~3–4% | Treasury-backed floor; minimal volatility | "Near-fixed, treasury-backed" |
| **Balanced** | ~50% Etherfuse + ~50% Blend Fixed Pool | ~5–6% | Fixed floor + stable variable upside | "Targets a range, with a protected floor" |
| **Growth** | Blend-weighted (e.g. ~20% Etherfuse + ~80% YieldBlox) | ~7–9% | Higher variable yield, more fluctuation | "Higher potential, variable, no guarantee" |

> *Blended APYs are **computed live** from the constituent strategies' current rates, shown as ranges/bands per the honesty model (§9.4). The figures here are early-2026 illustrative snapshots only.

> Allocations are **illustrative defaults** and must be tunable to whatever strategies are live on the target network. Exact percentages are an implementation/strategy decision, not a fixed contract constant.

### 9.4 The Honesty Model (Non-Negotiable Display Rules)

1. **Conservative** may be described as "near-fixed, treasury-backed." It is the *only* preset that gets a fixed-ish framing.
2. **Balanced & Growth** must **always** be shown with **ranges and confidence bands**, never a single guaranteed number. E.g., "projected 16–20 months to your goal, depending on variable yield."
3. All preset numbers shown to users are **pulled live** from the underlying DeFindex strategies (current APY/share-price data), not hardcoded.
4. The projection calculator (§12) must visually distinguish the **guaranteed-ish floor** from the **variable upside** in every projection.
5. No preset, screen, or marketing copy ever displays a "fixed X% guaranteed" for a variable strategy. This is a hard rule that protects against both user harm and regulatory exposure.
6. The comparison to local instruments (deposito/reksadana/ORI) is always framed in **USD purchasing-power terms** with the depreciation assumption stated.

### 9.5 Deposit Asset — USDC (not necessarily a treasury bond)

The asset a member deposits does **not** have to be a tokenized US treasury or USTRY Stablebond. The default deposit/accounting asset is **USDC**. The *strategy* the vault routes into may be treasury-backed (Conservative) or Blend-based (Balanced/Growth), but the member always thinks in plain dollars (and IDR-equivalent on screen).

### 9.6 The Yield Calculator Engine

A first-class feature (also see §12.4). The engine lets a user:

- Input an amount of money **or** auto-fill from the circle's current value.
- Choose a **target date** and a **preset**.
- Receive a **recommendation** that may suggest: add an initial *modal*, extend/shorten the time duration, or change the preset — whatever combination reaches the target, with ranges for variable presets.

The engine reads live preset rates from DeFindex and always honors the honesty model (§9.4).

### 9.7 Managed-Strategy Boundary (Honest Version)

- The "management" Lindi offers is **preset selection + group-vote rebalancing across existing DeFindex strategies** — not autonomous yield generation.
- **MVP boundary:** preset-based allocation + group-vote rebalance + a real projection calculator. **Do NOT** build live autonomous target-band rebalancing, and **do NOT** write custom DeFindex strategy contracts. Both are explicitly **production / separate-effort** scope (§15).
- Overpromising here is the single most likely way to break the demo.

### 9.8 Gas & Cost Economics

- Stellar base fees are fractions of a cent per operation. Sponsoring gas via **OpenZeppelin Relayer** for thousands of users is a rounding error, not a budget line.
- **Decision:** Lindi **absorbs gas** as a cost of doing business and **does not charge users explicit gas fees** (doing so would reintroduce the crypto-friction Lindi works to hide). The Relayer's **channels plugin** additionally keeps high-volume transaction bursts from jamming on sequence numbers. Gas cost is monetized indirectly through the yield-fee model (§16).

---

## 10. How Lindi Composes Stellar (Product View)

> This is the *product-level* view. Full architecture, contract data model, function signatures, and integration code → `docs/technical/`.

At a high level, Lindi has three layers:

1. **Mobile app (client)** — biometric onboarding, the circle room, growing-pot UI, strategy voting, and the yield calculator. The user lives here and never sees a chain.
2. **Application / backend layer** — session orchestration, notifications (WhatsApp/push), the projection engine, indexer reads, and submission of transactions through the **OpenZeppelin Relayer + Channels** (sponsored, parallelized, retried).
3. **Stellar / Soroban layer** —
   - **Lindi Core Contract** (Soroban/Rust): circle lifecycle, contributions, payout/withdrawal rules, governance votes, collateral/default handling, and per-circle vault management.
   - **OpenZeppelin `stellar-contracts`**: the audited account-abstraction logic (`__check_auth`) that validates biometric P256 signatures and enforces access/policy rules for each user's smart account.
   - **DeFindex vault (one per circle)**: holds the pot and routes it into audited strategies (Blend / Etherfuse) per the group preset.
   - **Soroswap**: swap utility for any required asset conversion (low priority).

User-facing infra:
- **smart-account-kit** — creates and signs from each user's biometric smart account.
- **OpenZeppelin Relayer + relayer-plugin-channels** — gasless UX, parallel submission, retry/fee-bump/webhook lifecycle.

---

## 11. Stellar Ecosystem Integration Map

This section makes explicit how Lindi composes the ecosystem — the "compose, don't reinvent" behavior SDF rewards. Showing this map on a single pitch slide is itself a scoring advantage.

| Stellar component | Category | How Lindi uses it | MVP? |
|---|---|---|---|
| **Soroban** | Smart-contract platform | Hosts the Lindi Core Contract (circle logic, governance, payout, vault management) | ✅ Core |
| **smart-account-kit** | Onboarding/wallet | Biometric (P256) smart wallets; no seed phrase | ✅ Core |
| **OpenZeppelin `stellar-contracts`** | On-chain account abstraction | Audited `__check_auth` logic validating biometric sigs + policy/access rules | ✅ Core |
| **OpenZeppelin Relayer + Channels** | Transaction infra | Sponsored gas, parallel channel submission, retry/fee-bump/webhooks | ✅ Core |
| **DeFindex** | Vault routing (yield hero) | Per-circle vault; one-click diversified allocation per preset; share/yield accounting | ✅ Core |
| **Blend** *(via DeFindex)* | Lending protocol | Variable-yield source (Fixed Pool + YieldBlox) | ✅ Core (through DeFindex) |
| **Etherfuse Stablebonds** *(via DeFindex)* | RWA / treasury | Near-fixed treasury floor (USTRY/CETES/TESOURO/USDC) | ✅ Core (through DeFindex) |
| **Soroswap** | DEX / swap utility | Best-execution swaps only when conversion is needed | ⚠️ MVP-light (low priority; can stub) |
| **Reflector** | Oracle | Price feed for IDR-equivalent display | ⚠️ MVP-light |
| **SEP-24 / SEP-31 Anchors** | Fiat on/off-ramp | IDR↔asset gateway | ❌ Production (mock for demo) |

> **Composition note:** Where a full integration risks consuming demo time for little visible value (e.g., live Reflector feeds, deep Soroswap routing), the MVP may use a simplified stub while keeping the *architecture* integration-ready. The contract and pitch present the full composition; the demo shows the load-bearing parts working — above all, the DeFindex vault earning real yield.

### 11.1 Why smart-account-kit (not legacy Passkey Kit, not Privy)

`passkey-kit` is the legacy precursor; **smart-account-kit** is its successor, built on **OpenZeppelin Smart Accounts** — supporting passkeys (secp256r1), Ed25519, and policy signers with context rules, session management, threshold multisig, and spending limits. Privy (embedded wallets) is excellent but EVM/Solana-centric — Stellar is not its native turf. smart-account-kit is the **native Stellar** answer and pairs directly with OZ `stellar-contracts` on-chain and the OZ Relayer for gasless UX. For a Stellar hackathon it is both the better technical fit and the stronger "we made crypto invisible" demo moment.

### 11.2 The On/Off-Ramp Reality (Stated Plainly)

There is **no major regulated IDR stablecoin live natively on Stellar**, and Indonesian licensed exchanges do not currently operate as Stellar SEP-24/SEP-31 anchors. This is both Lindi's biggest infrastructure constraint and its biggest future opportunity. Handling, by phase:

- **MVP (testnet):** Use testnet USDC + a **testnet-issued demo IDR-pegged asset** to show the full Rupiah→yield→Rupiah loop, clearly framed as a demonstration of the rail.
- **Production:** Integrate a **licensed Indonesian VASP/payment partner** (e.g., a regulated exchange) as the fiat gateway, or a Stellar anchor once IDR coverage matures. Framed as a roadmap partnership, timed to the OJK Q3-2026 framework.

---

## 12. Feature Specifications

Features are tagged **[MVP]** (testnet hackathon build) or **[PROD]** (production scope). Detailed scope tables are in §14–§15.

### 12.1 Onboarding & Identity

- **[MVP] Biometric smart-account onboarding** — sign up with phone number + Face ID/fingerprint; smart account created invisibly (smart-account-kit + OZ `stellar-contracts`); no seed phrase. Gas sponsored (OZ Relayer).
- **[MVP] Unique username** — user picks a unique username; all member references (invites, circle rosters) use it, never a raw address.
- **[MVP] Profile & circle membership** — minimal profile; create/join circles.
- **[PROD] KYC integration** — for production fiat ramps and compliance.

### 12.2 Circle Creation & Management

- **[MVP] Create Circle** — choose mode (Classic Rotating / Goal-Based / Public Pool), set members (by username), contribution amount, frequency, rounds; for Goal-Based, set custom label + target amount/date; set auto-compound toggle.
- **[MVP] Classic order field** — choose payout ordering: `by order`, `random-no-repeat` (winners removed from future draws), or `bid`. (Data fields prepared even where logic is MVP-light.)
- **[MVP] Join Circle** — accept invite (closed circles) or join a published one (Public Pool); stake collateral (default backstop) where applicable.
- **[MVP] Circle room** — members list, who's paid this round, whose turn is next, live pot balance, accrued yield, and the strategy vote. The heart of the app.
- **[MVP] Contribution flow** — deposit the round amount; enforce all-paid-before-payout (Classic/Goal); open-deposit for Public Pool.
- **[PROD] Circle templates** — preset configs for common goals (Lebaran, umroh, school).

### 12.3 Yield & Strategy

- **[MVP] Group strategy voting** — propose & vote a preset (Conservative/Balanced/Growth); majority/quorum resolves; the resolved vote **rebalances the circle's DeFindex vault**.
- **[MVP] Idle-pot yield deployment** — pot lives in a per-circle DeFindex vault routed into the voted preset's strategies (Blend / Etherfuse).
- **[MVP] Auto-compound toggle** — reinvest yield vs keep it claimable.
- **[MVP] Growing-pot display** — real-time balance with accrued yield (from live vault share price); the weekly re-engagement hook.
- **[PROD] Autonomous target-rebalancing** — dynamic management to hit a target band (explicitly out of MVP per §9.7).
- **[PROD] Custom DeFindex strategy** — writing a new audited strategy (e.g. Aqua/Phoenix LP) — separate Rust/Soroban + audit effort.

### 12.4 Goal Projection & Yield Calculator

- **[MVP] Simple projection (preset mode)** — pick a preset; see a projected growth curve to the goal, with **ranges** for variable presets.
- **[MVP] Yield calculator engine (target mode)** — input *modal* (or auto-fill from circle), pick a *target date* and a *preset*; the engine computes feasibility and **recommends**: add modal, extend/shorten timeline, or change preset — with confidence bands. (§9.6)
- **[MVP] USD-protection comparison** — show projected outcome vs deposito/reksadana/ORI in **USD purchasing-power terms** (with stated depreciation assumption).
- **[PROD] Scenario simulator** — stress-test goals against yield/FX scenarios.

### 12.5 Payout & Distribution

- **[MVP] Classic payout** — pot rotates to the round's recipient (order / random-no-repeat / bid).
- **[MVP] Goal payout** — final split at goal completion, showing total yield earned proudly.
- **[MVP] Unanimous early exit (Goal)** — all members agree → early withdrawal with a **dynamic penalty on earned yield** (default 15%, scaling down for high earners); principal never touched. (§8.10)
- **[MVP] Public Pool withdrawal** — each member withdraws their own share anytime.
- **[MVP] Change-goal-once** — label/amount/date editable once, unanimous approval.
- **[MVP] Default handling** — collateral slash to make the group whole.

### 12.6 Trust, Transparency & Notifications

- **[MVP] Transparent ledger view** — every contribution, payout, vault deposit/withdraw, and yield event visible to all members.
- **[MVP] WhatsApp/push notifications** — contribution reminders, payout alerts, "pot grew" nudges, vote prompts.
- **[MVP] Demo IDR loop screen** — show Rupiah in → USDC pot → Rupiah out via the testnet demo asset/mock anchor.
- **[PROD] Dispute/audit tools** — formal records for group governance.

### 12.7 Fiat Ramp

- **[MVP] Mock/testnet IDR gateway** — clearly-labeled demo ramp.
- **[PROD] Licensed VASP/anchor integration** — real IDR on/off-ramp.

---

## 13. User Flows

### 13.1 First-Time Onboarding (The "Invisible Crypto" Moment)

```
Open app → Enter phone number → Pick unique username → Face ID / fingerprint prompt
  → Smart account created invisibly (smart-account-kit + OZ stellar-contracts, P256)
  → No seed phrase, no XLM, no gas prompt (OZ Relayer sponsors)
  → Land on home screen with a clear "Create or Join a Circle" CTA
```

### 13.2 Classic Rotating Arisan (The Demo Opener)

```
Create Circle → mode: Classic Rotating → set 10 members (by username), Rp500k/month, 10 rounds, order: random-no-repeat
  → Members join (stake small collateral)
  → Round 1: all contribute → pot forms (Rp5jt) → deposited into the circle's DeFindex vault
  → [idle pot earns briefly — small bonus]
  → Payout: pot rotates to drawn member; winner removed from future draws
  → Repeat; transparent ledger updates; WhatsApp notifies
  → Demo highlight: show the ~$0.00001 fee (sponsored)
```

### 13.3 Goal-Based Collective Savings (The Demo Climax)

```
Create Circle → mode: Goal-Based → label "Umroh", goal Rp60jt, 12 months, auto-compound ON
  → Group votes strategy: Balanced → vote resolves → circle's DeFindex vault rebalances
  → Each member contributes monthly → pot accumulates & stays invested in the vault
  → [time advances] → pot visibly grows as vault share price rises (Blend + Etherfuse)
  → Yield calculator: "On track to hit Rp60jt in ~11 months (range 10–12)"
  → USD-protection comparison vs deposito shown
  → Goal reached → final split, total yield displayed proudly
  → (If life intervenes: unanimous vote → early exit with 15%-of-yield penalty, principal intact)
```

### 13.4 Group Strategy Vote (Rebalances the Vault)

```
Any member proposes a preset → other members notified
  → Members discuss (off-chain room) and vote on-chain
  → Quorum/majority resolves → Lindi (as vault manager) rebalances the circle's DeFindex vault to the chosen strategy
```

### 13.5 Public Pool (The "Anyone Can Join" Coda)

```
Organizer creates Circle → mode: Public Pool → preset: Conservative → publishes it
  → Anyone discovers and joins → each deposits their own share into the shared vault
  → Each participant's balance grows with yield; each withdraws their own share anytime
```

### 13.6 Default / Dropout (Classic)

```
Member #4 received pot in round 2 → stops contributing in round 3
  → handle_default(member #4) → collateral slashed
  → group made whole → ledger records the event transparently
```

---

## 14. MVP Scope (Hackathon / Testnet)

### 14.1 MVP Objective

Ship a **working, demoable, testnet** product that proves the core thesis end-to-end: invisible onboarding → group savings (all modes) → group-voted yield via a per-circle DeFindex vault → growing, USD-protected balance → projection → payout. Every MVP item must serve the 3-minute demo.

### 14.2 MVP — In Scope

| Area | Item | Notes |
|---|---|---|
| Onboarding | smart-account-kit biometric wallet + OZ Relayer gasless | Core "wow" |
| Identity | Unique username mapping | Hides addresses |
| Circle | Create/join, all three modes (Classic + Goal-Based + Public Pool) | Multi-mode is the hero |
| Contributions | Deposit, vault-native share accounting, all-paid enforcement | |
| Governance | Group strategy voting → vault rebalance (3 presets) | Novel mechanic |
| Yield | Per-circle DeFindex vault into Blend + Etherfuse strategies | Composition proof |
| Compound | Auto-compound toggle | |
| Calculator | Simple + target-mode yield calculator with ranges + USD comparison | Differentiator |
| Display | Growing-pot UI from live vault share price | Retention hook |
| Payout | Classic rotation + Goal final split + unanimous early-exit penalty + Public Pool withdraw | All modes |
| Goal | Custom label + date; change-once (unanimous) | |
| Default | Collateral-staking slash | Simplest backstop |
| Trust | Transparent ledger + WhatsApp/push notifications | |
| Fiat | Testnet demo IDR asset + mock ramp screen | Full loop illusion, honestly framed |
| Assets | Stellar **testnet** USDC + testnet demo-IDR asset | Decided: testnet-first |

### 14.3 MVP — Explicitly Out of Scope (Framed as Roadmap)

- Live autonomous target-rebalancing (the "Investment Manager" autopilot).
- Writing custom DeFindex strategy contracts (Aqua/Phoenix LP etc.) — separate audited effort.
- Real licensed IDR on/off-ramp (mainnet anchor/VASP).
- Mainnet treasury allocation + Indonesian eligibility compliance for Etherfuse assets.
- Reputation system; risk-ordered positioning.
- KYC/AML, dispute tooling, circle templates, scenario simulator.
- Issuing any real/regulated asset.

### 14.4 MVP Build Sequence (≈4 weeks)

| Week | Focus |
|---|---|
| **1** | Lindi Core Contract — create/join/contribute/payout for **Classic** on testnet USDC; provably-correct rotation + vault-native share accounting; smart-account onboarding wired to OZ Relayer |
| **2** | Add **Goal-Based** + **Public Pool** branches + collateral/default + unanimous early-exit penalty; write tests for the default + penalty paths (judges probe these) |
| **3** | **DeFindex vault integration** (per-circle vault, deposit/withdraw, rebalance) + **group strategy voting** + auto-compound — the differentiators; give real time |
| **4** | **Mobile frontend** (biometric onboarding, growing-pot screen, yield calculator, group room, demo-IDR loop) + polish |
| **Final days** | Pre-stage demo state; rehearse the 3-min script 5+ times; record a backup video |

> **Scope-cut rule:** If time compresses, cut in this order: scenario depth → Soroswap routing (stub it) → Reflector live feed (hardcode display rate) → Public Pool governance options (publisher-set preset only) → reduce to one or two DeFindex strategies. **Never** cut: biometric onboarding, dual-mode savings (Classic + Goal), group voting → vault rebalance, growing-pot display, yield calculator. These are the demo.

---

## 15. Production Scope (Post-Hackathon)

### 15.1 Production Objective

Convert the testnet proof into a mainnet, compliant, real-money product with sustainable unit economics and a path to multi-market scale.

### 15.2 Production — In Scope

| Area | Item |
|---|---|
| Fiat ramp | Licensed Indonesian VASP/anchor integration (real IDR on/off-ramp) |
| Assets | Mainnet USDC; mainnet Etherfuse strategies + verified Indonesian eligibility |
| Yield | Autonomous target-band rebalancing ("Investment Manager") within DeFindex strategies |
| Strategy | Commission/sponsor new audited DeFindex strategies (e.g. Aqua/Phoenix LP) if a pool is worth it |
| Compliance | KYC/AML; regulatory alignment with OJK Q3-2026 framework; legal structuring to avoid unlicensed deposit-taking/securities issuance |
| Trust | Reputation system, risk-ordered positioning, dispute/audit tooling |
| Product | Circle templates, scenario simulator, richer public-pool governance |
| Security | Full Lindi Core Contract audit(s); backstop/insurance exploration |
| Scale | Multi-market localization (paluwagan/tanda/chama/susu); multi-currency floors (CETES/TESOURO already available via DeFindex) |
| Growth | Referral/community growth loops; partnerships (cooperatives, communities) |

### 15.3 Production Compliance Posture

Lindi must be structured so it **composes** existing tokenized assets (via DeFindex) and routes user funds into them, rather than itself issuing securities or taking deposits in the regulated sense. The Q3-2026 OJK tokenization framework is the alignment target; a licensed fiat partner handles the regulated ramp. Legal review is a gating item before mainnet.

---

## 16. Business Model & Revenue

### 16.1 Revenue Mechanisms (Decided: Fee on Yield + Platform Fee)

| Mechanism | How it works | Rationale |
|---|---|---|
| **Fee on yield** (primary) | Lindi sets a fee on the **yield only** (never principal) earned by circle vaults. DeFindex's model lets an integrating app configure this fee (up to a 90% / 9,000 BPS cap). Of the fee collected, **DeFindex takes ~20% and Lindi keeps ~80%** (the negotiated revenue share). | Aligns Lindi's revenue with user benefit — Lindi only earns when users earn. Honest and scalable. |
| **Platform fee** (secondary) | A small fee per cycle / per circle for premium features or platform usage. | Predictable baseline revenue independent of yield levels. |
| **Early-exit penalty** (incidental) | The dynamic penalty on earned yield from unanimous early exits (§8.10) accrues to the circle/platform. | Discourages breaking goals; never touches principal. |

> The Lindi fee rate (in BPS, ≤9,000) is a tunable product decision; it is always charged on yield, never on deposits. See `technical/INTEGRATIONS.md` for the DeFindex fee-config API.

### 16.2 What Lindi Does NOT Charge

- **No explicit gas fees** — absorbed (gas is a rounding error; charging reintroduces friction). See §9.8.
- **No fee on principal** — only on yield.
- **No fantasy-yield upsell** — honesty is the brand.

### 16.3 Unit Economics (Illustrative)

- Gas cost per active user/month: negligible (cents).
- Revenue per circle scales with: pot size × time invested × yield rate × Lindi's fee share (×80% after DeFindex's cut).
- The model favors **long-cycle goal-based circles and public pools** (more money, sitting longer) — which is also where the user benefit is greatest. Incentives are aligned.

### 16.4 Why This Is Fundable

- Rotating savings is a **global primitive** with hundreds of millions of users in Stellar's target markets.
- The currency-protection wedge is **durable** (a decade-long trend).
- The yield-fee model is **proven and native to DeFindex** (the Beans pattern).
- The regulatory tailwind (OJK Q3-2026) creates a **timing advantage** for first movers.
- Clear path to **SCF Build Award** funding post-hackathon (SCF 7.0 rewards mainnet-readiness + traction, both of which Lindi's roadmap targets).

---

## 17. Demo Strategy & Pitch Narrative

The demo is a first-class deliverable, not an afterthought. Judges reward **clarity and a flawless demo over complexity**. The Philippines winners were not the most complex builds — they were the clearest.

### 17.1 The Narrative Arc (Local → Reveal → Global)

1. **Open local and human** — Bu Sri's arisan, a specific goal (Lebaran/Umroh), a real pain everyone feels.
2. **Show the familiar** — Classic rotating mode. "You all know this. This is arisan. Watch what changes on Stellar." (Show the near-zero, sponsored fee.)
3. **Reveal the magic** — Goal-Based mode + group strategy vote rebalancing a real DeFindex vault + the pot growing. "It's been earning the whole time — what a biscuit tin never could."
4. **Land the protection** — the USD-purchasing-power comparison vs deposito/reksadana/ORI.
5. **Zoom out once** — paluwagan/tanda/chama/susu + "and anyone can open a public pool"; one slide, one map, one big TAM number. "Built for the OJK regulation arriving this quarter — with treasury floors already live for Mexico and Brazil too."

### 17.2 The 3-Minute Demo Script

| Time | Show | Say |
|---|---|---|
| 0:00–0:30 | Bu Sri's arisan story (one slide) | Hundreds of millions save this way; the money sits idle and trust sits with one person. |
| 0:30–1:00 | **Biometric onboarding live** — phone + fingerprint, smart account appears, no seed phrase, no XLM | "She just opened a Stellar smart wallet with her fingerprint. No seed phrase. No crypto. We sponsor the gas." |
| 1:00–1:40 | **Classic mode**: create circle, contribute, pot forms, rotate payout | "This is arisan — exactly as she knows it. Note the fee: a fraction of a cent, sponsored." |
| 1:40–2:30 | **Goal-Based mode** + **strategy vote rebalances the vault** + pot grows; yield calculator | "The group votes how to grow the idle pot — and that vote rebalances their own DeFindex vault. It's been earning in treasuries and Blend the whole time. On track to hit Umroh in ~11 months." |
| 2:30–2:50 | USD-protection comparison + (demo) Rupiah loop | "In real dollar terms, this beats deposito and reksadana — because the rupiah keeps slipping. Real Rupiah in, real Rupiah out." |
| 2:50–3:00 | Global slide (paluwagan/tanda/chama/susu) + Public Pool + OJK Q3-2026 | "Arisan in Indonesia — and anyone can open a public pool. One contract, every emerging market Stellar wants." |

### 17.3 Demo Production Rules

- **Pre-stage all state.** Nothing loads live that can fail. Pre-fund wallets, pre-advance time for the yield reveal.
- **Record a backup video** of the full flow in case of live failure.
- **Rehearse 5+ times.** The script is muscle memory by demo day.
- **One hero per beat.** Don't crowd the screen; each beat shows one thing.

### 17.4 What SDF Judges Reward (Design To This)

- "Real products with real utility, not prototypes" — show a usable flow, not slideware.
- **Composability** — plug into existing building blocks (DeFindex → Blend + Etherfuse) instead of reinventing.
- **Local relevance + local assets** — the explicit ask, and Lindi's moat.
- **The "what happens after"** — SCF 7.0 scores mainnet-readiness and traction; Lindi's roadmap (§20) answers this directly.

### 17.5 Anticipated Judge Questions & Answers

| Likely question | Prepared answer |
|---|---|
| "Isn't this just GoodGhosting/ROSCA on-chain?" | The group-governed yield strategy that rebalances a real DeFindex vault + USD currency-protection + Indonesian local rails + invisible onboarding is the unbuilt part. Plain ROSCA dies on gas; Lindi runs on Stellar at ~$0.00001/tx with a treasury floor. |
| "How do you guarantee the yield?" | We don't, and we say so. Conservative is treasury-backed (near-fixed) via Etherfuse; Balanced/Growth are shown as live ranges. Honesty is the brand. |
| "Why DeFindex and not build your own vault?" | DeFindex is audited, exposes Blend + Etherfuse as one integration, and its share model gives us yield accounting for free. Writing our own strategies is an audited effort we don't need for the thesis. |
| "What about the IDR on/off-ramp?" | No regulated IDR anchor exists natively on Stellar yet. MVP shows the loop on testnet; production integrates a licensed VASP partner — timed to OJK Q3-2026. |
| "Will an ibu open an app just for arisan?" | We reframed it: continuous yield + growing-pot hook + long-cycle goal groups + public pools give weekly reasons to open. Retention rides the group's social pressure. |
| "Is this regulated/legal?" | Lindi composes existing tokenized assets via DeFindex and routes funds; it doesn't issue securities or take deposits in the regulated sense. Licensed partner handles the ramp; structured to align with OJK Q3-2026. |
| "What's your moat?" | The intersection — social trust + currency protection + honest composable yield + invisible UX + group governance, localized to Indonesia. No competitor unifies these. |

---

## 18. Risks, Constraints & Mitigations

| # | Risk | Severity | Mitigation |
|---|---|---|---|
| 1 | **DeFindex vault integration consumes more time than planned** | High | Build USDC-only with a single strategy first; add presets/rebalance once core works. Never let composition block a working demo. |
| 2 | **Dropout/default + penalty logic is fiddly** | Med | Ship collateral-staking + unanimous early-exit penalty only for MVP; present ordering + reputation as roadmap. Don't over-engineer. |
| 3 | **"Open once a month" retention doubt** | Med | Pre-empt on stage: long-cycle goal framing + growing-pot screen + public pools as the weekly hook. |
| 4 | **Etherfuse/treasury Indonesian eligibility (non-US-persons restriction)** | Med | Non-issue on testnet. Production compliance item; verify jurisdiction. Flag in §22. |
| 5 | **No native regulated IDR anchor on Stellar** | High (prod) | MVP mocks the loop on testnet; production uses licensed VASP partner. Framed honestly as roadmap. |
| 6 | **Mock anchor read as vaporware** | Med | Explicitly frame as a demo of the Q3-2026 loop; real partnership is the SCF milestone, not a claim. |
| 7 | **Overpromising autonomous fixed yield** | High | Hard honesty rules (§9.4); autonomous rebalancing + custom strategies are explicitly production/separate scope. |
| 8 | **Regulatory (deposit-taking/securities)** | High (prod) | Structure as composition + routing via DeFindex, not issuance/deposit; licensed partner for ramp; legal review gates mainnet. |
| 9 | **Smart-contract security/bugs** | High (prod) | Thorough MVP tests (esp. default + penalty paths); full audit before mainnet; build on audited primitives (DeFindex, Blend, OZ stellar-contracts) over custom code. |
| 10 | **DeFindex strategy liquidity/availability gaps on the target network** | Med | Verify live strategies before committing; have stub/single-strategy fallback; testnet representations for MVP. |
| 11 | **Scope creep** | High | Strict scope-cut rule (§14.4); demo-driven development principle (§7). |
| 12 | **Currency thesis weakens if rupiah stabilizes** | Low-Med | Never predict future depreciation; frame USD exposure as protection against a documented decade-long trend. |

---

## 19. Success Metrics

### 19.1 Hackathon Success Metrics

| Metric | Target |
|---|---|
| Working end-to-end testnet demo (all modes) | ✅ Complete & rehearsed |
| Live biometric onboarding in demo | ✅ Zero-friction, no seed phrase |
| Protocols composed (DeFindex → Blend + Etherfuse, OZ Relayer, smart-account-kit) | ≥ 3 visibly integrated |
| Real on-chain yield in a per-circle DeFindex vault | ✅ Demonstrated live/pre-staged |
| Demo runs without live failure | ✅ Pre-staged + backup video |
| Judge comprehension of UVP in <30s | ✅ One-sentence pitch lands |
| Placement | Top prize / category win |
| Post-hackathon | SCF Build Award application submitted |

### 19.2 Production North-Star & Supporting Metrics

| Metric | Why it matters |
|---|---|
| **Total value saved (TVS)** | North-star: real money entrusted to Lindi |
| Monthly active circles (incl. public pools) | Engagement & retention proxy |
| Member retention (cycle-over-cycle) | The social-mechanic thesis validated |
| Avg. pot duration | Drives both user benefit and revenue (long = good) |
| Yield delivered vs local benchmarks (USD terms) | Proves the core value prop |
| On-ramp conversion (once live) | Funnel health |
| Revenue (yield-fee ×80% + platform fee) | Unit-economics validation |

---

## 20. Roadmap

| Phase | Timeline | Focus | Key deliverables |
|---|---|---|---|
| **Phase 0 — Hackathon** | Now → submission | Testnet MVP | Multi-mode circles, biometric onboarding, per-circle DeFindex vault yield, yield calculator, demo |
| **Phase 1 — Post-Hackathon** | 0–3 months | SCF + hardening | SCF Build Award, contract audit, mainnet contract, pilot with real arisan groups |
| **Phase 2 — Fiat & Compliance** | 3–6 months | Real money | Licensed VASP/anchor IDR ramp, KYC, mainnet Etherfuse + eligibility, OJK alignment |
| **Phase 3 — Depth** | 6–12 months | Trust & autopilot | Reputation, risk-ordered positioning, autonomous rebalancing, dispute tooling, templates |
| **Phase 4 — Scale** | 12+ months | Multi-market | paluwagan/tanda/chama/susu localization, multi-currency floors (CETES/TESOURO), community growth loops |

---

## 21. Brainstorm Section — Suggested Features

> Features proposed for consideration. **Not committed scope** — pull any into MVP/Production as you see fit. Each notes its rationale and rough effort.

### 21.1 Engagement & Retention

- **Goal countdown & milestone celebrations** — visual "Rp42jt of Rp60jt to Umroh, 4 months left" with small celebratory moments at milestones. *Rationale:* turns the growing-pot hook into a habit. *Effort:* Low. *Suggested:* MVP-light.
- **Streaks & gentle social nudges** — "Bu Sri hasn't contributed this round" surfaced kindly to the group. *Rationale:* social pressure is the retention engine. *Effort:* Low. *Suggested:* MVP.
- **"What your money did" monthly recap** — a friendly summary of yield earned + purchasing power protected. *Rationale:* makes the invisible benefit visible. *Effort:* Low-Med. *Suggested:* Production.

### 21.2 Trust & Inclusion

- **Sharia-compliant mode flag** — clearly mark which DeFindex strategies/structures are Sharia-aligned (label/filter only, not a full RWA-syariah product). *Rationale:* huge Indonesian market; low effort to label. *Effort:* Low (label only). *Suggested:* Production.
- **Bilingual UX (Bahasa Indonesia first, English toggle)** — *Rationale:* trust & accessibility for the hero market and judge legibility. *Effort:* Low. *Suggested:* MVP.
- **Voice/low-literacy onboarding aids** — *Rationale:* broadens inclusion. *Effort:* Med. *Suggested:* Production.

### 21.3 Financial Depth

- **"Safe floor, stretch goal" dual-target** — let a goal have a guaranteed-floor target (Conservative) and a stretch target (if Balanced/Growth outperforms). *Rationale:* makes the honesty model a feature. *Effort:* Med. *Suggested:* Production.
- **Auto-contribution (standing order)** — schedule contributions so members don't miss rounds. *Rationale:* retention + reduces default. *Effort:* Med. *Suggested:* Production.
- **Emergency partial withdrawal (Goal mode)** — controlled early access with clear trade-off display (ties to the §8.10 penalty model). *Rationale:* real-life flexibility; reduces churn. *Effort:* Med-High (affects yield accounting). *Suggested:* Production.

### 21.4 Growth & Network Effects

- **Invite-to-circle referral loop** — circles grow by inviting neighbors (by username); small reward for completed cycles. *Rationale:* arisan is inherently viral/social. *Effort:* Low-Med. *Suggested:* Production.
- **Public-pool discovery feed** — a browsable list of open public pools to join. *Rationale:* turns Public Pool mode into a growth surface. *Effort:* Med. *Suggested:* Production.
- **Community/cooperative partnerships** — onboard existing arisan groups, religious communities, cooperatives wholesale. *Rationale:* fastest real-world adoption path. *Effort:* (BD, not eng). *Suggested:* Production.

### 21.5 Differentiators Worth Considering for the Demo

- **Live "fee comparison" toggle** — show the same transaction cost on Ethereum vs Stellar. *Rationale:* dramatizes why this is only viable on Stellar. *Effort:* Low (illustrative). *Suggested:* MVP demo flourish.
- **"Purchasing power protected" counter** — a running figure of rupiah-value protected vs holding cash. *Rationale:* makes the core thesis tangible on screen. *Effort:* Low-Med. *Suggested:* MVP-light.

---

## 22. Open Questions & Decisions Log

### 22.1 Decisions Locked

| # | Decision | Choice |
|---|---|---|
| D1 | Product nature | **Multi-mode, group as hero** |
| D2 | MVP includes classic rotating arisan? | **Yes** (alongside goal-based and public pool) |
| D3 | Revenue model | **Fee on yield (≤90% BPS; ~80% Lindi / ~20% DeFindex) + platform fee** |
| D4 | MVP fiat/asset approach | **Testnet-first**: testnet USDC + testnet demo-IDR asset + mock ramp |
| D5 | Market scope | **Indonesia hero + multi-market growth evidence (CETES/TESOURO floors already live)** |
| D6 | Hero value prop | **USD-protection disguised as familiar savings** |
| D7 | Wallet/onboarding | **smart-account-kit + OZ `stellar-contracts` + OZ Relayer/Channels** (over passkey-kit/Privy/Launchtube) |
| D8 | Yield engine | **DeFindex as the sole yield integration** (exposes Blend + Etherfuse); no custom strategies for MVP |
| D9 | Autonomous rebalancing / custom strategies | **Production / separate-effort scope** (not MVP) |
| D10 | Goal-Based early withdrawal trigger | **Unanimous (all members must agree)** |
| D11 | Early-exit penalty | **Dynamic % of earned yield (default 15%, scales down for high earners); never principal** |
| D12 | Vault model | **One dedicated DeFindex vault per circle; Lindi is manager; group vote rebalances it** |
| D13 | Identity | **Unique username mapped to smart-account address (no raw addresses shown)** |
| D14 | Change goal | **Once per circle, unanimous approval** |
| D15 | New mode | **Public Pool (published, open-join, per-member deposit/withdraw)** |

### 22.2 Open Questions (To Resolve Before/During Build)

| # | Question | Owner | Notes |
|---|---|---|---|
| Q1 | Mobile framework: React Native vs Flutter? | Eng lead | Flutter has a proven Soroban smart-wallet demo; RN may have broader team familiarity |
| Q2 | One strategy vs full 3-preset allocation for MVP DeFindex vault? | Eng lead | Depends on Week-3 time; fallback is single-strategy USDC vault |
| Q3 | Which single default defense ships in demo? | Product | Recommended: collateral staking |
| Q4 | Hero yield preset for the demo number — Conservative (safe) vs Balanced (bigger story, must show ranges)? | Product | Balanced tells a better story but must show ranges |
| Q5 | Verify live DeFindex strategies (Blend + Etherfuse) on the target testnet | Eng | Gating technical check before committing each preset |
| Q6 | Verify Indonesian eligibility for Etherfuse assets (production) | Legal/BD | Non-US-persons restriction; production-only concern |
| Q7 | Exact Lindi fee rate (BPS, ≤9,000) on yield | Product | Tunable; charged on yield only |
| Q8 | Exact preset allocation percentages | Product/Eng | Illustrative defaults in §9.3; tune with live testnet rates |
| Q9 | Public Pool governance — publisher-set preset only, or open vote? | Product | MVP default: publisher-set; voting optional |
| Q10 | Dynamic early-exit penalty curve (how % scales with earned yield) | Product/Eng | Default 15% cap; define the scaling function in `technical/YIELD-ENGINE.md` |
| Q11 | Per-circle vault seed deposit — who funds the mandatory first deposit at vault creation? | Eng/Product | First deposit sets share ratio; likely the circle creator's initial contribution |
| Q12 | Team split: who owns contract / frontend / pitch? | All | Assign owners early |

---

## 23. Glossary

| Term | Definition |
|---|---|
| **Arisan** | Indonesian rotating savings circle; members contribute regularly and the pooled pot rotates to one member each round. |
| **ROSCA** | Rotating Savings and Credit Association — the global category arisan belongs to (paluwagan, tanda, chama, susu, hui, etc.). |
| **Bendahara** | The arisan treasurer who traditionally holds the pooled cash. |
| **Circle** | Lindi's core object: a savings group with a mode, members, schedule, preset, a dedicated DeFindex vault, and (optionally) a goal. |
| **Public Pool** | A published, open-join circle where anyone deposits and withdraws their own share, with no rotating turn order. |
| **DeFindex** | Stellar vault-routing protocol; one-click diversified allocation across audited strategies; the vault share ("dfToken") rises in value as yield accrues; revenue via a share of the app's yield fee. **Lindi's sole yield integration.** |
| **dfToken / vault share** | The non-rebasing share token a DeFindex vault mints to depositors; its value rises as yield accrues. Lindi uses it as native share accounting. |
| **Strategy** | An audited DeFindex contract that puts vault funds to work (e.g. Blend Fixed Pool, Blend YieldBlox, Etherfuse Pool). |
| **Blend** | Stellar's leading lending/borrowing protocol; source of variable yield (Fixed Pool V2, YieldBlox V2). Accessed via DeFindex. |
| **Etherfuse Stablebond** | Tokenized government-bond-backed RWA (USTRY=US, CETES=Mexico, TESOURO=Brazil); non-rebasing; near-fixed. Accessed via DeFindex's Etherfuse strategy. |
| **Soroswap** | Stellar DEX aggregator; used by Lindi only as a swap utility for asset conversion. Note: Soroswap's "Earn" product is itself powered by DeFindex vaults (so it offers nothing beyond Lindi's direct DeFindex integration), and its AMM **LP fee yield** (0.3% pro-rata to liquidity providers) is not exposed as a DeFindex strategy — hence Soroswap stays swap-only in Lindi. |
| **Reflector** | Stellar price oracle (for IDR-equivalent display). |
| **smart-account-kit** | TS SDK (kalepail) for OpenZeppelin Smart Accounts on Stellar; biometric (secp256r1/P256) smart wallets with policies; successor to the legacy passkey-kit. |
| **OpenZeppelin `stellar-contracts`** | Audited Soroban contract library; provides the account-abstraction `__check_auth` logic that validates biometric signatures and enforces access/policy rules. |
| **OpenZeppelin Relayer + relayer-plugin-channels** | Infra that sponsors gas (gasless UX), parallelizes submission across channel accounts, and manages the transaction lifecycle (retry, fee-bump, webhooks). Replaces Launchtube. |
| **Soroban** | Stellar's smart-contract platform (Rust/WASM). |
| **SEP-24 / SEP-31** | Stellar Ecosystem Proposals for interactive (24) and cross-border (31) fiat on/off-ramps via anchors. |
| **Anchor** | An entity bridging fiat and the Stellar network (issues/redeems tokenized fiat). |
| **SCF** | Stellar Community Fund — SDF's builder funding program; post-hackathon Build Award path. |
| **SDF** | Stellar Development Foundation — the non-profit stewarding Stellar; sets ecosystem priorities and funds builders. |
| **OJK** | Otoritas Jasa Keuangan — Indonesia's financial services authority; the Q3-2026 tokenization framework is the regulatory tailwind. |
| **Preset** | A group-voted risk strategy (Conservative / Balanced / Growth) governing the circle vault's DeFindex strategy allocation. |
| **Non-rebasing** | A token whose yield accrues via rising price rather than increasing token count. |

---

> **End of PRD v2.0.** This is the anchor document for Lindi's development — the product bible. Technical detail lives in `docs/technical/`. Update the Decisions Log (§22) as choices are made; keep the honesty model (§9.4) and scope-cut rule (§14.4) inviolable. When build reality diverges from this document, **update this document.**
