import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import legacy from "@vitejs/plugin-legacy";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [
    react(),
    legacy({
      targets: ["defaults", "not IE 11"],
    }),
  ],
  optimizeDeps: {
    include: ["konva"],
  },
  server: {
    host: true,
    port: 5173,
  },
  resolve: {
    alias: {
      "@telegram-apps/sdk": resolve("node_modules/@telegram-apps/sdk/src"),
    },
  },
});
