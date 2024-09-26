import { defineConfig, configDefaults } from "vitest/config";

export default defineConfig({
  test: {
    exclude: [...configDefaults.exclude, "e2e/**"],
    coverage: {
      exclude: [
        "**/build/**",
        "**/coverage/**",
        "**/docs/**",
        "**/logs/**",
        "**/tests/**",
        "**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*",
      ],
    },
  },
});
