/**
 * Mock implementation of LindiDataSource. Backs the whole app today.
 * Swap this for a live implementation later — the UI never changes.
 */
import type { LindiDataSource, PreparedTx, ProjectionInput } from '../datasource';
import type { ProjectionResult } from '../models';
import {
  activity,
  circles,
  currentUser,
  notifications,
  openVote,
  presets,
} from './fixtures';

const delay = <T>(value: T, ms = 250): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

const preparedTx = (kind: string, summary: string): PreparedTx => ({
  id: `mocktx_${Math.random().toString(36).slice(2, 8)}`,
  kind,
  summary,
});

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
  listPublicPools: () => delay(circles.filter((c) => c.isPublic)),
  getActivity: (circleId) => delay(activity.filter((a) => a.circleId === circleId)),
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
