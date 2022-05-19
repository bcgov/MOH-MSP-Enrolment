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
  // Below configuration is for use with npm link. Can be removed after common-lib-vue is working and published for vue-3
  chainWebpack: (config) => {
    config.resolve.symlinks(false)
    config.resolve.alias.set( 'vue', path.resolve('./node_modules/vue'))
  }
};
