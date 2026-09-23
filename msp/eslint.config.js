// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");

module.exports = tseslint.config(
  {
    // Generated coverage HTML report, not source; gitignored, never authored.
    ignores: ["coverage/**"],
  },
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      "@angular-eslint/directive-selector": [
        "warn",
        {
          type: "attribute",
          prefix: "msp",
          style: "camelCase",
        },
      ],
      // Several pre-existing selectors ("general-app", "app-root" and a handful
      // of others) predate this migration; renaming them touches the app's
      // public API and deploy-facing markup for no functional benefit, so this
      // stays a warning.
      "@angular-eslint/component-selector": [
        "warn",
        {
          type: "element",
          prefix: "msp",
          style: "kebab-case",
        },
      ],
      // This app is deliberately NgModule based and consumes the shared
      // library through its compatibility shim. Converting components to
      // standalone is out of scope, so this rule would only ever report the
      // intended design.
      "@angular-eslint/prefer-standalone": "off",
      // Pre-existing HTTP payload and ControlValueAccessor signatures; typing
      // them is separate work.
      "@typescript-eslint/no-explicit-any": "warn",
      // Renaming an @Output changes the app's own public API, out of scope.
      "@angular-eslint/no-output-on-prefix": "warn",
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {
      // Several templates use the idiomatic `!= null` / `== null` to test for
      // both null and undefined in one comparison. Forcing `!==`/`===` there
      // would narrow the check to null only, silently dropping the undefined
      // case - a behaviour change, not a style fix. All other loose
      // comparisons still error.
      "@angular-eslint/template/eqeqeq": [
        "error",
        { allowNullOrUndefined: true },
      ],
    },
  }
);
