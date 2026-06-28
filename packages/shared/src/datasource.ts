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
  Message,
  Notification,
  PresetInfo,
  ProjectionResult,
  StrategyVote,
  User,
} from './models';
import type { CircleMode, Preset } from './enums';

/** Discover-feed filter for public pools (PRD §8.7 / D16). */
export interface PublicPoolFilter {
  tags?: string[]; // match any of these interest tags
  query?: string; // free-text search over name/headline/tags
  tierMax?: Decimal; // only pools whose minimum is <= this
  sort?: 'size' | 'apy' | 'recent';
}

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

/** Inputs collected by the Create-Circle flow (PRD §12.2). */
export interface CreateCircleInput {
  mode: CircleMode;
  name: string;
  preset: Preset;
  autoCompound: boolean;
  // CLASSIC / GOAL schedule
  contributionAmount?: Decimal;
  roundDurationDays?: number;
  totalRounds?: number;
  // GOAL
  goalLabel?: string;
  goalAmount?: Decimal;
  goalDate?: string;
  // PUBLIC_POOL
  isPublic?: boolean;
  tierMin?: Decimal;
  cap?: Decimal;
  tags?: string[];
}

export interface LindiDataSource {
  // ---- identity ----
  getCurrentUser(): Promise<User>;

  // ---- reads ----
  getCircle(id: number): Promise<Circle>;
  listMyCircles(userId: string): Promise<Circle[]>;
  listPublicPools(filter?: PublicPoolFilter): Promise<Circle[]>;
  listTags(): Promise<{ slug: string; label: string; count: number }[]>;
  getActivity(circleId: number): Promise<ActivityEvent[]>;
  getMessages(circleId: number): Promise<Message[]>;
  sendMessage(circleId: number, body: string): Promise<Message>;
  getOpenVote(circleId: number): Promise<StrategyVote | null>;
  getNotifications(userId: string): Promise<Notification[]>;

  // ---- yield (display-only, honesty-compliant) ----
  getPresets(): Promise<PresetInfo[]>;
  project(input: ProjectionInput): Promise<ProjectionResult>;

  // ---- writes (return prepared tx for client signing; mock = stub) ----
  buildContribute(circleId: number, round: number, amount: Decimal): Promise<PreparedTx>;
  buildVote(voteId: string, approve: boolean): Promise<PreparedTx>;
  buildJoinCircle(circleId: number, collateral: Decimal): Promise<PreparedTx>;
  buildCreateCircle(input: CreateCircleInput): Promise<PreparedTx>;
}
