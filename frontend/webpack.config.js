// webpack.config.js
const Dotenv = require('dotenv-webpack');


module.exports = {
  // 其他配置...
  plugins: [
    new Dotenv(),
  ],
  resolve: {
    fallback: {
      path: require.resolve("path-browserify"),
      os: require.resolve("os-browserify/browser"),
      crypto: require.resolve("crypto-browserify")
    }
  }
};
