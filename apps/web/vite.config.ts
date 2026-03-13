import tailwind from "@tailwindcss/vite"
import react from "@vitejs/plugin-react-swc"
/// <reference types="vitest/config" />
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwind()],
  resolve: {
    alias: {
      "~": "/src",
    },
  },
  test: {
    environment: "happy-dom",
    globals: true,
    setupFiles: "./src/__tests__/setup.ts",
  },
})
