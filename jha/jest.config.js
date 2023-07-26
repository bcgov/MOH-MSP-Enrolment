module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{js,vue}",
    "!src/main.js", // No need to cover bootstrap file
    "!src/locale/strings.en.js", // No need to cover strings
    "!src/settings.js"
  ],
}
