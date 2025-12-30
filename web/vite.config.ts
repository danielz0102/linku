import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react-swc"
import path from "path"
import { defineConfig } from "vitest/config"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "src"),
    },
  },
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: "./src/__tests__/setup.ts",
    coverage: {
      provider: "v8",
      exclude: ["node_modules/", "dist/", "**/*.test.ts", "**/*.test.tsx"],
    },
    // include: ["**/*.test.{ts,tsx}"],
  },
})
