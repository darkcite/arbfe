const path = require('path');

module.exports = {
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      fallback: {
        "stream": require.resolve("stream-browserify"),
        "assert": require.resolve("assert/"),
        "http": require.resolve("stream-http"),
        "https": require.resolve("https-browserify"),
        "os": require.resolve("os-browserify/browser"),
        "url": require.resolve("url/")
      }
    }
  },
  chainWebpack: config => {
    config.plugin('provide').use(require('webpack').ProvidePlugin, [{
      process: 'process/browser', // this is necessary, it's related to the polyfills
      Buffer: ['buffer', 'Buffer'] // and this is for things that might require buffer
    }]);
  }
}
