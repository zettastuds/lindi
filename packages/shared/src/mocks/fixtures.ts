/**
 * Demo-realistic mock data. Covers the states the UI must handle:
 * forming circle, active goal mid-progress, completed-with-yield, a default event,
 * a public pool, an open vote, unread notifications.
 *
 * Shapes match models.ts exactly — these are the same types the live source returns.
 * Money is decimal strings; magnitudes are realistic (Rupiah-scale) so layout is
 * tested against real widths.
 */
import {
  ActivityType,
  Channel,
  CircleMode,
  CircleStatus,
  ClassicOrder,
  MemberRole,
  NotifType,
  Preset,
  VoteKind,
  VoteStatus,
} from '../enums';
import type {
  ActivityEvent,
  Circle,
  Membership,
  Message,
  Notification,
  PresetInfo,
  StrategyVote,
  User,
} from '../models';

export const currentUser: User = {
  id: 'u_sri',
  username: 'busri',
  smartAccountAddress: 'GBUSRI...XYZ',
  phone: '+6281200000001',
  displayName: 'Bu Sri',
  locale: 'ID',
  createdAt: '2026-05-01T08:00:00Z',
};

const member = (
  i: number,
  username: string,
  shares: string,
  contributed: string,
  extra: Partial<Membership> = {},
): Membership => ({
  id: `m_${i}`,
  circleId: 0,
  userId: `u_${username}`,
  username,
  shares,
  totalContributed: contributed,
  hasReceived: false,
  collateralLocked: '50.00',
  role: i === 0 ? MemberRole.Creator : MemberRole.Member,
  active: true,
  joinedAt: '2026-05-02T08:00:00Z',
  ...extra,
});

/** Goal-based, mid-progress, has earned yield — the demo climax circle. */
export const goalCircle: Circle = {
  id: 1,
  mode: CircleMode.GoalBased,
  preset: Preset.Balanced,
  status: CircleStatus.Active,
  name: 'Umroh Bersama',
  creatorUserId: 'u_sri',
  goalLabel: 'Umroh',
  goalAmount: '3800.00', // ~Rp60jt in USDC terms
  goalDate: '2027-04-01',
  goalChanged: false,
  contributionAmount: '32.00',
  roundDurationDays: 30,
  totalRounds: 12,
  currentRound: 7,
  autoCompound: true,
  isPublic: false,
  vaultAddress: 'CVAULT1...AAA',
  potValue: '2240.00',
  potValueIdr: '35840000',
  apy: 5.6,
  totalYieldEarned: '41.30',
  memberCount: 5,
  members: [
    member(0, 'busri', '460.00', '448.00'),
    member(1, 'andi', '460.00', '448.00'),
    member(2, 'maya', '460.00', '448.00'),
    member(3, 'rina', '430.00', '420.00'),
    member(4, 'dewi', '430.00', '420.00'),
  ].map((m) => ({ ...m, circleId: 1 })),
  createdAt: '2026-05-02T08:00:00Z',
};

/** Classic rotating — the familiar demo opener. */
export const classicCircle: Circle = {
  id: 2,
  mode: CircleMode.ClassicRotating,
  preset: Preset.Conservative,
  order: ClassicOrder.RandomNoRepeat,
  status: CircleStatus.Active,
  name: 'Arisan RT 04',
  creatorUserId: 'u_sri',
  contributionAmount: '32.00',
  roundDurationDays: 30,
  totalRounds: 10,
  currentRound: 3,
  autoCompound: false,
  isPublic: false,
  vaultAddress: 'CVAULT2...BBB',
  potValue: '320.00',
  potValueIdr: '5120000',
  apy: 3.4,
  totalYieldEarned: '1.10',
  memberCount: 10,
  members: [
    member(0, 'busri', '32.00', '96.00', { hasReceived: true, payoutPosition: 1 }),
    member(1, 'andi', '32.00', '96.00', { payoutPosition: 2 }),
    member(2, 'maya', '32.00', '96.00', { payoutPosition: 3 }),
  ].map((m) => ({ ...m, circleId: 2 })),
  createdAt: '2026-04-01T08:00:00Z',
};

/** Public pool — open-join, the "anyone can join" coda. Bu Sri is a member here. */
export const publicPool: Circle = {
  id: 3,
  mode: CircleMode.PublicPool,
  preset: Preset.Conservative,
  status: CircleStatus.Active,
  name: 'Tabungan Dollar Warga',
  headline: 'Tabungan dollar terbuka — Aman, dilindungi treasury',
  creatorUserId: 'u_dewi',
  autoCompound: true,
  isPublic: true,
  tags: ['warga', 'pemula', 'aman'],
  tierMin: '5.00',
  cap: '20000.00',
  vaultAddress: 'CVAULT3...CCC',
  potValue: '8120.00',
  potValueIdr: '129920000',
  apy: 3.9,
  totalYieldEarned: '210.40',
  memberCount: 38,
  members: [member(0, 'busri', '210.00', '205.00')].map((m) => ({ ...m, circleId: 3 })),
  createdAt: '2026-03-15T08:00:00Z',
};

/** Discover-feed public pools (Bu Sri is NOT a member — they appear only in Jelajah). */
export const discoverPools: Circle[] = [
  {
    id: 10,
    mode: CircleMode.PublicPool,
    preset: Preset.Balanced,
    status: CircleStatus.Active,
    name: 'Umroh 2027 Bareng',
    headline: 'Kumpul bareng menuju Tanah Suci 2027',
    creatorUserId: 'u_ust',
    autoCompound: true,
    isPublic: true,
    tags: ['umroh', 'ibadah', 'jangka-panjang'],
    tierMin: '20.00',
    cap: '50000.00',
    vaultAddress: 'CVAULT10..UMR',
    potValue: '24300.00',
    potValueIdr: '388800000',
    apy: 5.6,
    totalYieldEarned: '880.00',
    memberCount: 112,
    members: [],
    createdAt: '2026-02-10T08:00:00Z',
  },
  {
    id: 11,
    mode: CircleMode.PublicPool,
    preset: Preset.Conservative,
    status: CircleStatus.Active,
    name: 'Dana Sekolah Anak',
    headline: 'Tabungan SPP & seragam, mulai dari kecil',
    creatorUserId: 'u_rina',
    autoCompound: true,
    isPublic: true,
    tags: ['anak-sekolah', 'keluarga', 'aman'],
    tierMin: '3.00',
    vaultAddress: 'CVAULT11..SKL',
    potValue: '6450.00',
    potValueIdr: '103200000',
    apy: 3.8,
    totalYieldEarned: '142.00',
    memberCount: 64,
    members: [],
    createdAt: '2026-04-20T08:00:00Z',
  },
  {
    id: 12,
    mode: CircleMode.PublicPool,
    preset: Preset.Growth,
    status: CircleStatus.Active,
    name: 'Modal Usaha UMKM',
    headline: 'Putar modal usaha, hasil lebih tinggi (bervariasi)',
    creatorUserId: 'u_budi',
    autoCompound: true,
    isPublic: true,
    tags: ['modal-usaha', 'umkm', 'tumbuh'],
    tierMin: '50.00',
    cap: '100000.00',
    vaultAddress: 'CVAULT12..UMK',
    potValue: '41200.00',
    potValueIdr: '659200000',
    apy: 8.1,
    totalYieldEarned: '2310.00',
    memberCount: 203,
    members: [],
    createdAt: '2026-01-05T08:00:00Z',
  },
  {
    id: 13,
    mode: CircleMode.PublicPool,
    preset: Preset.Balanced,
    status: CircleStatus.Active,
    name: 'Dana Darurat Keluarga',
    headline: 'Simpanan darurat yang tetap tumbuh',
    creatorUserId: 'u_maya',
    autoCompound: true,
    isPublic: true,
    tags: ['darurat', 'keluarga', 'pemula'],
    tierMin: '10.00',
    vaultAddress: 'CVAULT13..DRT',
    potValue: '15780.00',
    potValueIdr: '252480000',
    apy: 5.4,
    totalYieldEarned: '470.00',
    memberCount: 89,
    members: [],
    createdAt: '2026-03-01T08:00:00Z',
  },
];

export const circles: Circle[] = [goalCircle, classicCircle, publicPool, ...discoverPools];

/** Curated tag vocabulary for the Discover filter chips (DATA-MODEL PoolTag). */
export const tags: { slug: string; label: string; count: number }[] = [
  { slug: 'umroh', label: 'Umroh', count: 1 },
  { slug: 'anak-sekolah', label: 'Anak Sekolah', count: 1 },
  { slug: 'modal-usaha', label: 'Modal Usaha', count: 1 },
  { slug: 'darurat', label: 'Dana Darurat', count: 1 },
  { slug: 'keluarga', label: 'Keluarga', count: 2 },
  { slug: 'aman', label: 'Aman', count: 2 },
  { slug: 'tumbuh', label: 'Tumbuh', count: 1 },
  { slug: 'pemula', label: 'Pemula', count: 2 },
];

export const openVote: StrategyVote = {
  id: 'v_1',
  circleId: 1,
  kind: VoteKind.Strategy,
  proposedPreset: Preset.Growth,
  proposedBy: 'u_andi',
  quorum: 3,
  status: VoteStatus.Open,
  ballots: [
    { id: 'b1', voteId: 'v_1', voterUserId: 'u_andi', approve: true, castAt: '2026-06-25T10:00:00Z' },
    { id: 'b2', voteId: 'v_1', voterUserId: 'u_maya', approve: true, castAt: '2026-06-25T11:00:00Z' },
  ],
  openedAt: '2026-06-25T10:00:00Z',
};

export const presets: PresetInfo[] = [
  {
    preset: Preset.Conservative,
    label: 'Aman',
    blendedApy: 3.5,
    apyLow: 3.0,
    apyHigh: 4.0,
    nearFixed: true,
    claim: 'Dijamin treasury, hampir tetap',
  },
  {
    preset: Preset.Balanced,
    label: 'Seimbang',
    blendedApy: 5.6,
    apyLow: 5.0,
    apyHigh: 6.0,
    nearFixed: false,
    claim: 'Target ~5–6%, dengan lantai terlindungi',
  },
  {
    preset: Preset.Growth,
    label: 'Tumbuh',
    blendedApy: 8.0,
    apyLow: 7.0,
    apyHigh: 9.0,
    nearFixed: false,
    claim: 'Potensi lebih tinggi, bervariasi, tanpa jaminan',
  },
];

export const activity: ActivityEvent[] = [
  {
    id: 'a1',
    circleId: 1,
    type: ActivityType.Contributed,
    actorUserId: 'u_maya',
    actorUsername: 'maya',
    data: { round: 7, amount: '32.00' },
    occurredAt: '2026-06-24T09:00:00Z',
  },
  {
    id: 'a2',
    circleId: 1,
    type: ActivityType.StrategyProposed,
    actorUserId: 'u_andi',
    actorUsername: 'andi',
    data: { preset: Preset.Growth },
    occurredAt: '2026-06-25T10:00:00Z',
  },
  {
    id: 'a3',
    circleId: 1,
    type: ActivityType.Rebalanced,
    data: { preset: Preset.Balanced },
    occurredAt: '2026-05-10T10:00:00Z',
  },
];

export const notifications: Notification[] = [
  {
    id: 'n1',
    userId: 'u_sri',
    circleId: 1,
    type: NotifType.PotGrew,
    title: 'Tabunganmu tumbuh',
    body: 'Umroh Bersama bertambah Rp42.000 bulan ini.',
    channel: Channel.Push,
    sentAt: '2026-06-25T07:00:00Z',
  },
  {
    id: 'n2',
    userId: 'u_sri',
    circleId: 1,
    type: NotifType.VoteOpen,
    title: 'Voting strategi dibuka',
    body: 'Andi mengusulkan strategi Tumbuh. Beri suaramu.',
    channel: Channel.InApp,
    sentAt: '2026-06-25T10:01:00Z',
  },
  {
    id: 'n3',
    userId: 'u_sri',
    circleId: 2,
    type: NotifType.ContributionDue,
    title: 'Setoran ronde 3',
    body: 'Arisan RT 04 menunggu setoranmu.',
    channel: Channel.WhatsApp,
    sentAt: '2026-06-23T08:00:00Z',
  },
];

/**
 * Circle room feed for circle 1 (Umroh) — chat + system events fused (PRD §12.9).
 * `system` messages are projections of on-chain activity; `vote_prompt` renders an
 * inline vote card; `milestone` is a celebration. Interleaved by time.
 */
export const messages: Message[] = [
  {
    id: 'msg1',
    circleId: 1,
    authorUserId: 'u_sri',
    authorUsername: 'busri',
    kind: 'text',
    body: 'Assalamualaikum semua 🙏 yuk kita semangat nabung Umroh!',
    createdAt: '2026-06-20T08:00:00Z',
  },
  {
    id: 'msg2',
    circleId: 1,
    authorUserId: 'u_maya',
    authorUsername: 'maya',
    kind: 'system',
    body: 'Maya menyetor Rp512.000 untuk ronde 7',
    meta: { activityEventId: 'a1', eventType: 'CONTRIBUTED' },
    createdAt: '2026-06-24T09:00:00Z',
  },
  {
    id: 'msg3',
    circleId: 1,
    authorUserId: 'u_andi',
    authorUsername: 'andi',
    kind: 'text',
    body: 'Tabungan kita udah Rp35jt lho, hasilnya lumayan 👍',
    createdAt: '2026-06-24T12:30:00Z',
  },
  {
    id: 'msg4',
    circleId: 1,
    authorUserId: 'u_andi',
    authorUsername: 'andi',
    kind: 'vote_prompt',
    body: 'Andi mengusulkan ganti strategi ke Tumbuh',
    meta: { voteId: 'v_1' },
    createdAt: '2026-06-25T10:00:00Z',
  },
  {
    id: 'msg5',
    circleId: 1,
    authorUserId: 'system',
    authorUsername: 'Lindi',
    kind: 'milestone',
    body: '🎉 59% menuju Umroh — tinggal Rp24,6jt lagi!',
    meta: { pct: 0.59, goalLabel: 'Umroh' },
    createdAt: '2026-06-25T10:05:00Z',
  },
];
