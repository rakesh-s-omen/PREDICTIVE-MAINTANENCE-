module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      const oneOfRule = webpackConfig.module.rules.find(rule => rule.oneOf).oneOf;
      const babelLoader = oneOfRule.find(
        rule => rule.loader && rule.loader.includes('babel-loader')
      );
      if (babelLoader) {
        if (Array.isArray(babelLoader.include)) {
          babelLoader.include.push(/node_modules[\\/]three-mesh-bvh/);
        } else if (babelLoader.include) {
          babelLoader.include = [babelLoader.include, /node_modules[\\/]three-mesh-bvh/];
        } else {
          babelLoader.include = [/node_modules[\\/]three-mesh-bvh/];
        }
      }
      return webpackConfig;
    }
  }
};
