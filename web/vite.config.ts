/// <reference types="vitest/config" />
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import tailwind from "@tailwindcss/vite"

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
