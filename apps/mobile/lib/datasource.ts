/**
 * The app's single data source. Today: mock. Later: swap one line to a live
 * implementation (backend/chain) — no component changes (CLAUDE §4, DATA-MODEL §8).
 */
import { mockDataSource, type LindiDataSource } from '@lindi/shared';

export const data: LindiDataSource = mockDataSource;
