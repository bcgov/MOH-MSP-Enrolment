module.exports = {
  root: true,
  env: {
    node: true,
    es2022: true,
  },
  extends: ["plugin:vue/essential", "eslint:recommended"],
  parserOptions: {
    ecmaVersion: 13,
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
  },
};
