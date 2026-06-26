// Metro config for a pnpm monorepo + NativeWind.
// - watchFolders: let Metro see the workspace packages (@lindi/*)
// - nodeModulesPaths: resolve hoisted deps from the repo root
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];
config.resolver.disableHierarchicalLookup = false;

module.exports = withNativeWind(config, { input: './global.css' });
