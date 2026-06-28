/**
 * Mock implementation of LindiDataSource. Backs the whole app today.
 * Swap this for a live implementation later — the UI never changes.
 */
import type {
  LindiDataSource,
  PreparedTx,
  ProjectionInput,
  PublicPoolFilter,
} from '../datasource';
import type { Message, ProjectionResult } from '../models';
import {
  activity,
  circles,
  currentUser,
  messages,
  notifications,
  openVote,
  presets,
  tags,
} from './fixtures';

const delay = <T>(value: T, ms = 250): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

const preparedTx = (kind: string, summary: string): PreparedTx => ({
  id: `mocktx_${Math.random().toString(36).slice(2, 8)}`,
  kind,
  summary,
});

/** Filter + sort public pools for the Discover feed (PRD §8.7 / D16). */
function filterPublicPools(filter?: PublicPoolFilter) {
  let pools = circles.filter((c) => c.isPublic);
  if (filter?.tags?.length) {
    pools = pools.filter((c) => c.tags?.some((t) => filter.tags!.includes(t)));
  }
  if (filter?.query) {
    const q = filter.query.toLowerCase();
    pools = pools.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.headline?.toLowerCase().includes(q) ||
        c.tags?.some((t) => t.includes(q)),
    );
  }
  if (filter?.tierMax) {
    pools = pools.filter((c) => Number(c.tierMin ?? 0) <= Number(filter.tierMax));
  }
  const sort = filter?.sort ?? 'size';
  pools = [...pools].sort((a, b) => {
    if (sort === 'apy') return b.apy - a.apy;
    if (sort === 'recent') return b.createdAt.localeCompare(a.createdAt);
    return Number(b.potValue) - Number(a.potValue); // size
  });
  return pools;
}

/** Plain TVM projection so the calculator works on mock numbers (YIELD-ENGINE §4). */
function projectMock(input: ProjectionInput): ProjectionResult {
  const principal = Number(input.principal) || 0;
  const monthly = Number(input.monthlyContribution) || 0;
  const target = Number(input.targetAmount) || 0;
  const apy = presets.find((p) => p.preset === input.preset)?.blendedApy ?? 4;
  const r = apy / 100 / 12;

  const monthsFor = (rate: number): number => {
    let balance = principal;
    let m = 0;
    while (balance < target && m < 600) {
      balance = (balance + monthly) * (1 + rate);
      m++;
    }
    return m;
  };

  const lo = presets.find((p) => p.preset === input.preset)?.apyLow ?? apy;
  const hi = presets.find((p) => p.preset === input.preset)?.apyHigh ?? apy;
  const mid = monthsFor(r);
  let finalBalance = principal;
  for (let i = 0; i < mid; i++) finalBalance = (finalBalance + monthly) * (1 + r);

  return {
    monthsToGoal: mid,
    monthsLow: monthsFor(hi / 100 / 12),
    monthsHigh: monthsFor(lo / 100 / 12),
    finalValue: finalBalance.toFixed(2),
    floorValue: (principal + monthly * mid).toFixed(2),
    recommendation:
      mid > 24
        ? 'Tambah modal awal, perpanjang waktu, atau pilih preset lebih tinggi.'
        : undefined,
  };
}

export const mockDataSource: LindiDataSource = {
  getCurrentUser: () => delay(currentUser),

  getCircle: (id) => {
    const c = circles.find((x) => x.id === id);
    if (!c) return Promise.reject(new Error(`circle ${id} not found`));
    return delay(c);
  },
  listMyCircles: (userId) =>
    delay(circles.filter((c) => c.members.some((m) => m.userId === userId) || c.creatorUserId === userId)),
  listPublicPools: (filter) => delay(filterPublicPools(filter)),
  listTags: () => delay(tags),
  getActivity: (circleId) => delay(activity.filter((a) => a.circleId === circleId)),
  getMessages: (circleId) => delay(messages.filter((m) => m.circleId === circleId)),
  sendMessage: (circleId, body) => {
    const msg: Message = {
      id: `msg_${Math.random().toString(36).slice(2, 8)}`,
      circleId,
      authorUserId: currentUser.id,
      authorUsername: currentUser.username,
      kind: 'text',
      body,
      createdAt: new Date().toISOString(),
    };
    messages.push(msg);
    return delay(msg);
  },
  getOpenVote: (circleId) => delay(openVote.circleId === circleId ? openVote : null),
  getNotifications: (userId) => delay(notifications.filter((n) => n.userId === userId)),

  getPresets: () => delay(presets),
  project: (input) => delay(projectMock(input)),

  buildContribute: (circleId, round, amount) =>
    delay(preparedTx('contribute', `Setor ${amount} ke circle ${circleId} ronde ${round}`)),
  buildVote: (voteId, approve) =>
    delay(preparedTx('vote', `Vote ${approve ? 'setuju' : 'tolak'} pada ${voteId}`)),
  buildJoinCircle: (circleId, collateral) =>
    delay(preparedTx('join', `Gabung circle ${circleId}, jaminan ${collateral}`)),
};
