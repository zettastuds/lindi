/**
 * Canonical enums — reuse everywhere (mobile, backend, mocks, contract mirror).
 * Mirrors docs/technical/DATA-MODEL.md §7. Keep in lockstep.
 *
 * Using string-literal unions (not TS `enum`) so values serialize cleanly across
 * the wire and into mock JSON, and tree-shake well.
 */

export const CircleMode = {
  ClassicRotating: 'CLASSIC_ROTATING',
  GoalBased: 'GOAL_BASED',
  PublicPool: 'PUBLIC_POOL',
} as const;
export type CircleMode = (typeof CircleMode)[keyof typeof CircleMode];

export const Preset = {
  Conservative: 'CONSERVATIVE',
  Balanced: 'BALANCED',
  Growth: 'GROWTH',
} as const;
export type Preset = (typeof Preset)[keyof typeof Preset];

export const ClassicOrder = {
  ByOrder: 'BY_ORDER',
  RandomNoRepeat: 'RANDOM_NO_REPEAT',
  Bid: 'BID',
} as const;
export type ClassicOrder = (typeof ClassicOrder)[keyof typeof ClassicOrder];

export const CircleStatus = {
  Forming: 'FORMING',
  Active: 'ACTIVE',
  Completed: 'COMPLETED',
  Defaulted: 'DEFAULTED',
} as const;
export type CircleStatus = (typeof CircleStatus)[keyof typeof CircleStatus];

export const MemberRole = {
  Creator: 'CREATOR',
  Member: 'MEMBER',
} as const;
export type MemberRole = (typeof MemberRole)[keyof typeof MemberRole];

export const VoteKind = {
  Strategy: 'STRATEGY',
  EarlyExit: 'EARLY_EXIT',
  ChangeGoal: 'CHANGE_GOAL',
} as const;
export type VoteKind = (typeof VoteKind)[keyof typeof VoteKind];

export const VoteStatus = {
  Open: 'OPEN',
  Resolved: 'RESOLVED',
  Rejected: 'REJECTED',
} as const;
export type VoteStatus = (typeof VoteStatus)[keyof typeof VoteStatus];

export const PayoutKind = {
  ClassicRotation: 'CLASSIC_ROTATION',
  GoalFinal: 'GOAL_FINAL',
  PublicWithdraw: 'PUBLIC_WITHDRAW',
  EarlyExit: 'EARLY_EXIT',
} as const;
export type PayoutKind = (typeof PayoutKind)[keyof typeof PayoutKind];

export const FeeKind = {
  YieldFee: 'YIELD_FEE',
  EarlyExitPenalty: 'EARLY_EXIT_PENALTY',
  PlatformFee: 'PLATFORM_FEE',
} as const;
export type FeeKind = (typeof FeeKind)[keyof typeof FeeKind];

export const NotifType = {
  ContributionDue: 'CONTRIBUTION_DUE',
  ContributionReceived: 'CONTRIBUTION_RECEIVED',
  PayoutReady: 'PAYOUT_READY',
  PotGrew: 'POT_GREW',
  VoteOpen: 'VOTE_OPEN',
  VoteResolved: 'VOTE_RESOLVED',
  GoalReached: 'GOAL_REACHED',
  DefaultAlert: 'DEFAULT_ALERT',
  Invite: 'INVITE',
  EarlyExitProposed: 'EARLY_EXIT_PROPOSED',
} as const;
export type NotifType = (typeof NotifType)[keyof typeof NotifType];

export const Channel = {
  Push: 'PUSH',
  WhatsApp: 'WHATSAPP',
  InApp: 'IN_APP',
} as const;
export type Channel = (typeof Channel)[keyof typeof Channel];

export const Locale = {
  Id: 'ID',
  En: 'EN',
} as const;
export type Locale = (typeof Locale)[keyof typeof Locale];

export const ActivityType = {
  CircleCreated: 'CIRCLE_CREATED',
  MemberJoined: 'MEMBER_JOINED',
  Contributed: 'CONTRIBUTED',
  StrategyProposed: 'STRATEGY_PROPOSED',
  StrategyResolved: 'STRATEGY_RESOLVED',
  Rebalanced: 'REBALANCED',
  PaidOut: 'PAID_OUT',
  GoalCompleted: 'GOAL_COMPLETED',
  EarlyExit: 'EARLY_EXIT',
  GoalChanged: 'GOAL_CHANGED',
  Defaulted: 'DEFAULTED',
  Claimed: 'CLAIMED',
  Withdrawn: 'WITHDRAWN',
} as const;
export type ActivityType = (typeof ActivityType)[keyof typeof ActivityType];
