module.exports = {
  runtimeCompiler: true,
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        // target: "https://next.bahnvorhersage.de",
      },
    },
  },

  css: {
    loaderOptions: {
      sass: {
        additionalData: `
          @use 'sass:color';
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
    assetsVersion: "0.4.2",
  },
};
