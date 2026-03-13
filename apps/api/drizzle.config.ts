import { DATABASE_URL } from "#shared/config/env.js"
import { defineConfig } from "drizzle-kit"

export default defineConfig({
  out: "./drizzle",
  schema: "./src/shared/db/drizzle/schemas.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: DATABASE_URL,
  },
})
