const path = require('path');

module.exports = {
  // ... Otras configuraciones de Webpack ...

  resolve: {
    fallback: {
      "crypto": require.resolve("crypto-browserify"),
      "stream": require.resolve("stream-browserify")
    }
  }
};
