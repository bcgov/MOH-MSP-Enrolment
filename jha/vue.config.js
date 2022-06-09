const path = require('path')

module.exports = {
  publicPath: '/ahdc/',
  devServer: {
    proxy: {
      '/api': {
        target: 'https://jha-web-f0463d-dev.apps.silver.devops.gov.bc.ca',
        changeOrigin: true,
      },
    }
  },
  lintOnSave: true,
};
