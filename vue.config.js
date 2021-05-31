const AbsoluteModuleMapperPlugin = require("absolute-module-mapper-plugin");
const settings = require("./settings.json");

module.exports = {
  transpileDependencies: ["vuetify"],

  publicPath: process.env.NODE_ENV === "production" ? settings.publicPath : "/",

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
