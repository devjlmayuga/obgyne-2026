const webpack = require('webpack');

const nextConfig = {
  webpack: config => {
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(
        /react-perfect-scrollbar\/dist\/css\/styles\.css$/,
        require.resolve('./src/client/emptyStyleModule.js')
      )
    );

    return config;
  }
};

module.exports = nextConfig;
