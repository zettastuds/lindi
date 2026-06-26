/**
 * The seam between UI and the world. The mobile app depends ONLY on this interface.
 * Today it's backed by mock fixtures; later by the live backend/chain. Swapping
 * implementations changes nothing in the components (DATA-MODEL §8.3, CLAUDE §4).
 *
 * Writes return a `PreparedTx` (an unsigned, simulated transaction). In the mock
 * impl this is a no-op stub; in the live impl the client signs it with the passkey
 * and the backend relays it (ARCHITECTURE §4). Keeping the signature now means the
 * blockchain team can drop in the real implementation without touching the UI.
 */
import type {
  ActivityEvent,
  Circle,
  Decimal,
  Notification,
  PresetInfo,
  ProjectionResult,
  StrategyVote,
  User,
} from './models';
import type { Preset } from './enums';

export interface PreparedTx {
  /** Opaque to the UI. Mock: a fake id. Live: prepared XDR + auth entries. */
  id: string;
  kind: string;
  summary: string;
}

export interface ProjectionInput {
  principal: Decimal;
  monthlyContribution: Decimal;
  preset: Preset;
  targetAmount?: Decimal;
  targetDate?: string;
}

export interface LindiDataSource {
  // ---- identity ----
  getCurrentUser(): Promise<User>;

  // ---- reads ----
  getCircle(id: number): Promise<Circle>;
  listMyCircles(userId: string): Promise<Circle[]>;
  listPublicPools(): Promise<Circle[]>;
  getActivity(circleId: number): Promise<ActivityEvent[]>;
  getOpenVote(circleId: number): Promise<StrategyVote | null>;
  getNotifications(userId: string): Promise<Notification[]>;

  // ---- yield (display-only, honesty-compliant) ----
  getPresets(): Promise<PresetInfo[]>;
  project(input: ProjectionInput): Promise<ProjectionResult>;

  // ---- writes (return prepared tx for client signing; mock = stub) ----
  buildContribute(circleId: number, round: number, amount: Decimal): Promise<PreparedTx>;
  buildVote(voteId: string, approve: boolean): Promise<PreparedTx>;
  buildJoinCircle(circleId: number, collateral: Decimal): Promise<PreparedTx>;
}
