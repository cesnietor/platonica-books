import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import checker from "vite-plugin-checker";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    checker({
      typescript: true,
      eslint: {
        lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
        useFlatConfig: true,
      },
    }),
  ],
  clearScreen: false, // ← keep previous logs visible
  logLevel: "info", // or 'debug' for even more detail
  server: {
    hmr: {
      overlay: true, // ensure the error overlay is enabled
    },
  },
});
