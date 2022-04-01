module.exports = {
  // chainWebpack: config => {
  //   config.resolve.alias.set('vue', '@vue/compat')

  //   config.module
  //     .rule('vue')
  //     .use('vue-loader')
  //     .tap(options => {
  //       return {
  //         ...options,
  //         compilerOptions: {
  //           compatConfig: {
  //             MODE: 2
  //           }
  //         }
  //       }
  //     })
  // },
  runtimeCompiler: true,
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
      },
    },
  },

  css: {
    loaderOptions: {
      sass: {
        additionalData: `
          @import 'src/assets/scss/variables';
          @import 'bootstrap/scss/_functions.scss'; @import 'bootstrap/scss/_variables.scss'; @import 'bootstrap/scss/_mixins.scss';
        `,
      },
    },
  },

  pwa: {
    name: "Bahn-Vorhersage",
    themeColor: "#3f51b5",
    msTileColor: "#212121",
    manifestOptions: {
      background_color: "#212121",
      short_name: "Bahn-Vorhersage",
    },
    assetsVersion: "0.3.1",
  },
};
