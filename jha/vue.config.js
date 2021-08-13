module.exports = {
  publicPath: '/jha/',
  devServer: {
    proxy: {
      '/api': {
        target: 'https://jha-web-f0463d-dev.apps.silver.devops.gov.bc.ca',
        changeOrigin: true,
      },
    }
  },
  lintOnSave: true
};
