const AbsoluteModuleMapperPlugin = require("absolute-module-mapper-plugin");

module.exports = {
  transpileDependencies: ["vuetify"],
  chainWebpack: (config) => {
    config.resolve.plugin("absolute-module-mapper-plugin").use(AbsoluteModuleMapperPlugin, [
      {
        root: __dirname,
        include: ["**/node_modules/vue-persist-decorator/**"],
        requestMapper: {
          "vue-class-component": "<root>/node_modules/vue-class-component/dist/vue-class-component.esm.js",
        },
      },
    ]);
  },
};
