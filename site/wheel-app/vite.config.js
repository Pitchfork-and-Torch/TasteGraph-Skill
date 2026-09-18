import { defineConfig } from "vite";

// Dev: base /
// Prod build for site: base /wheel/
export default defineConfig(({ mode }) => ({
  base: mode === "production" ? "/wheel/" : "/",
  server: {
    host: "127.0.0.1",
    port: 5177,
    strictPort: true,
  },
  preview: {
    host: "127.0.0.1",
    port: 5177,
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    assetsDir: "assets",
    sourcemap: false,
  },
}));
