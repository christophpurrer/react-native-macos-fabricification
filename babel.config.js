module.exports = function babelConfig(api) {
  api.cache.never();
  return {
    babelrc: true,
    babelrcRoots: [
      // Keep the root as a root
      '.',
    ],
    presets: ['@babel/typescript'],
    plugins: ['@babel/plugin-transform-modules-commonjs'],
  };
};
