import { defineConfig } from "drizzle-kit"
import { DATABASE_URL } from "#shared/config/env.js"

export default defineConfig({
  out: "./drizzle",
  schema: "./src/shared/db/drizzle/schemas.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: DATABASE_URL,
  },
})
