import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: true,
    lib: {
      entry: "src/index.tsx",
      formats: ["iife"],
      name: "HboPluginDashboard",
      fileName: () => "index.js",
    },
    rollupOptions: {
      external: [],
      output: { extend: true },
    },
  },
});
