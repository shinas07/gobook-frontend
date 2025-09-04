// webpack.config.js
const { createExpoWebpackConfigAsync } = require('@expo/webpack-config');

module.exports = async function(env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  // You can customize here if needed, for now just return the config
  return config;
};
