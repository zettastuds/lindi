/**
 * @lindi/shared — canonical types, enums, the data-source seam, and mock data.
 * Mirrors docs/technical/DATA-MODEL.md. Mobile + backend both import from here.
 */
export * from './enums';
export * from './models';
export * from './datasource';
export { mockDataSource } from './mocks/mockDataSource';
export * as fixtures from './mocks/fixtures';
