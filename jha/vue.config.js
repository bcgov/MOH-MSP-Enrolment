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
  chainWebpack: (config) => {
    config.resolve.alias.set('vue', '@vue/compat')

    config.module
      .rule('vue')
      .use('vue-loader')
      .tap((options) => {
        return {
          ...options,
          compilerOptions: {
            compatConfig: {
              MODE: 2,
            }
          }
        }
      })
  }
};
