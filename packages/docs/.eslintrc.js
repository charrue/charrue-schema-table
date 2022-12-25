module.exports = {
  extends: ["@charrue/vue3", "../../.eslintrc"],
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
  },
  rules: {
    "vue/multi-word-component-names": "off",
  },
};
