/**
 * Domain models — the TS shape of every entity in docs/technical/DATA-MODEL.md.
 * Mock fixtures AND real API/chain responses both satisfy these types, so swapping
 * the data source is not a refactor (see datasource.ts).
 *
 * MONEY RULE: all monetary amounts are decimal strings (e.g. "112.50"), never JS
 * `number` — floats corrupt money. UI formats for display. APYs/percentages may be
 * numbers (display-only, non-custodial).
 */
import type {
  ActivityType,
  Channel,
  CircleMode,
  CircleStatus,
  ClassicOrder,
  FeeKind,
  Locale,
  MemberRole,
  NotifType,
  PayoutKind,
  Preset,
  VoteKind,
  VoteStatus,
} from './enums';

export type Decimal = string; // decimal-as-string money
export type ISODate = string; // "2026-06-26"
export type ISODateTime = string; // "2026-06-26T10:00:00Z"
export type Address = string; // Stellar G... / C... address

export interface User {
  id: string;
  username: string; // unique — surfaced everywhere
  smartAccountAddress: Address;
  phone: string;
  displayName?: string;
  avatarUrl?: string;
  locale: Locale;
  createdAt: ISODateTime;
}

export interface Device {
  id: string;
  userId: string;
  credentialId: string; // public WebAuthn id
  publicKey: string; // P256 public key
  label: string;
  isBackup: boolean;
  lastUsedAt?: ISODateTime;
}

export interface Membership {
  id: string;
  circleId: number;
  userId: string;
  username: string; // denormalized for display
  shares: Decimal;
  totalContributed: Decimal;
  hasReceived: boolean; // CLASSIC
  payoutPosition?: number; // CLASSIC order index
  collateralLocked: Decimal;
  role: MemberRole;
  active: boolean;
  joinedAt: ISODateTime;
}

export interface Circle {
  id: number;
  mode: CircleMode;
  preset: Preset;
  order?: ClassicOrder; // CLASSIC
  status: CircleStatus;
  name: string;
  creatorUserId: string;
  // GOAL fields
  goalLabel?: string; // user text: "Umroh"
  goalAmount?: Decimal;
  goalDate?: ISODate;
  goalChanged?: boolean;
  // schedule (CLASSIC/GOAL)
  contributionAmount?: Decimal;
  roundDurationDays?: number;
  totalRounds?: number;
  currentRound?: number;
  // settings
  autoCompound: boolean;
  isPublic: boolean;
  // vault / value (cached from chain+vault)
  vaultAddress: Address;
  potValue: Decimal; // USDC
  potValueIdr: Decimal;
  apy: number; // live blended APY (display-only)
  totalYieldEarned: Decimal;
  memberCount: number;
  members: Membership[];
  createdAt: ISODateTime;
}

export interface StrategyVote {
  id: string;
  circleId: number;
  kind: VoteKind;
  proposedPreset?: Preset; // STRATEGY
  proposedBy: string; // userId
  quorum: number;
  status: VoteStatus;
  resolvedPreset?: Preset;
  ballots: VoteBallot[];
  openedAt: ISODateTime;
  resolvedAt?: ISODateTime;
}

export interface VoteBallot {
  id: string;
  voteId: string;
  voterUserId: string;
  approve: boolean;
  txHash?: string;
  castAt: ISODateTime;
}

export interface Contribution {
  id: string;
  circleId: number;
  userId: string;
  round: number;
  amount: Decimal;
  sharesMinted: Decimal;
  txHash?: string;
  createdAt: ISODateTime;
}

export interface Payout {
  id: string;
  circleId: number;
  round?: number; // CLASSIC
  recipientUserId?: string; // CLASSIC
  kind: PayoutKind;
  amount: Decimal;
  yieldPortion: Decimal;
  penaltyApplied?: Decimal; // early-exit
  txHash?: string;
  createdAt: ISODateTime;
}

export interface FeeRecord {
  id: string;
  circleId: number;
  kind: FeeKind;
  grossYield?: Decimal;
  amount: Decimal; // Lindi's share
  defindexShare?: Decimal; // ~20% cut
  txHash?: string;
  createdAt: ISODateTime;
}

export interface ActivityEvent {
  id: string;
  circleId: number;
  type: ActivityType;
  actorUserId?: string;
  actorUsername?: string; // denormalized
  data: Record<string, unknown>;
  ledger?: number;
  txHash?: string;
  occurredAt: ISODateTime;
}

export interface Notification {
  id: string;
  userId: string;
  circleId?: number;
  type: NotifType;
  title: string;
  body: string;
  channel: Channel;
  payload?: Record<string, unknown>;
  readAt?: ISODateTime;
  sentAt: ISODateTime;
}

export interface Message {
  id: string;
  circleId: number;
  authorUserId: string;
  authorUsername: string; // denormalized
  kind: 'text' | 'system' | 'vote_prompt' | 'milestone';
  body: string;
  meta?: Record<string, unknown>;
  createdAt: ISODateTime;
}

export interface Invite {
  id: string;
  circleId: number;
  inviterUserId: string;
  inviteeUsername?: string;
  inviteePhone?: string;
  code: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  expiresAt: ISODateTime;
}

export interface PublicListing {
  id: string;
  circleId: number;
  headline: string;
  description?: string;
  coverUrl?: string;
  publishedByUserId: string;
  isActive: boolean;
  publishedAt: ISODateTime;
}

export interface VaultRef {
  vaultAddress: Address;
  circleId: number;
  strategies: { address: Address; allocBps: number }[];
  totalAssets: Decimal;
  totalSupply: Decimal;
  pricePerShare: Decimal;
  manager: Address; // = Lindi Core contract
  feeBps: number; // Lindi yield fee (<= 9000)
  syncedAt: ISODateTime;
}

/** A yield preset's live, ranged numbers for the honesty-compliant UI (YIELD-ENGINE §3-4). */
export interface PresetInfo {
  preset: Preset;
  label: string;
  blendedApy: number; // mid
  apyLow: number;
  apyHigh: number;
  nearFixed: boolean; // only Conservative = true
  claim: string; // honest framing string
}

/** Output of the yield calculator (YIELD-ENGINE §4). */
export interface ProjectionResult {
  monthsToGoal: number;
  monthsLow: number;
  monthsHigh: number;
  finalValue: Decimal;
  floorValue: Decimal; // the guaranteed-ish floor line
  recommendation?: string; // "add Rp2jt modal OR extend 2 months OR switch to Balanced"
}
