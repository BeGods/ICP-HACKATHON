// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    target: "esnext",
  },
  optimizeDeps: {
    include: ["konva"],
  },
  server: {
    host: true,
    port: 5174,
  },
});
