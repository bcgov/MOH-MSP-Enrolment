import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  base: "/ahdc/",
  plugins: [
    vue({
      // This is needed so Vite can find web image paths
      // For example, <img src="/images/logo.png"> will not work without the code below
      template: {
        transformAssetUrls: {
          includeAbsolute: false,
        },
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"],
  },
  test: {
    environment: "jsdom",
  },
  server: {
    proxy: {
      "/ahdc/api": {
        target: "https://jha-web-f0463d-dev.apps.silver.devops.gov.bc.ca/",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
