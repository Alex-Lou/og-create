const { defineConfig } = require('@vue/cli-service');
const TerserPlugin = require('terser-webpack-plugin'); // Importation de TerserPlugin

module.exports = defineConfig({
  transpileDependencies: true,
  // Ajout des feature flags
  chainWebpack: (config) => {
    config.plugin('define').tap((definitions) => {
      Object.assign(definitions[0], {
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false),
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
        __VUE_OPTIONS_API__: JSON.stringify(true),
        __VUE_PROD_DEVTOOLS__: JSON.stringify(false)
      });
      return definitions;
    });
  },
  configureWebpack: {
    performance: {
      hints: false
    },
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true, // Supprime les appels à la console en production
            },
          },
        }),
      ],
    }
  }
});
