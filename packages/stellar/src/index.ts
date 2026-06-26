/**
 * @lindi/stellar — the LIVE side of the data-source seam. PLACEHOLDER for now.
 *
 * The blockchain team implements `LindiDataSource` (from @lindi/shared) here using
 * the real stack — @stellar/stellar-sdk, @defindex/sdk, smart-account-kit, the OZ
 * Relayer client. When ready, the mobile app swaps one line in apps/mobile/lib/datasource.ts:
 *
 *     import { liveDataSource } from '@lindi/stellar';
 *     export const data = liveDataSource;
 *
 * Until then the app runs entirely on @lindi/shared's mockDataSource. The UI never
 * changes — only this implementation does. See docs/technical/INTEGRATIONS.md and
 * DATA-MODEL.md §8.
 */
import type { LindiDataSource } from '@lindi/shared';

// TODO(blockchain): implement against real chain/backend.
export const liveDataSource: Partial<LindiDataSource> = {};
