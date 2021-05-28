module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ["plugin:vue/base", "eslint:recommended"],
  plugins: ["vuetify", "prettier"],
  parserOptions: {
    parser: "babel-eslint",
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "vuetify/no-deprecated-classes": "error",
  },
};
