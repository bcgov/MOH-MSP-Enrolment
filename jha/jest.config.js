module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  transformIgnorePatterns: ["node_modules/(?!axios)"], //The 1.x.x version of axios changed the module type from CommonJS to ECMAScript. This option transpiles the module so Jest runs it
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{js,vue}",
    "!src/main.js", // No need to cover bootstrap file
    "!src/locale/strings.en.js", // No need to cover strings
    "!src/settings.js"
  ],
}
