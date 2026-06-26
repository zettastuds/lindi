module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    plugins: [
      // Reanimated 4 uses the worklets plugin (replaces react-native-reanimated/plugin).
      // Must remain LAST in the plugins list.
      'react-native-worklets/plugin',
    ],
  };
};
