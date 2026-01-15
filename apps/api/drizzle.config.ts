import { DB_URL } from "#config/env.js"
import { defineConfig } from "drizzle-kit"

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schemas.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: DB_URL,
  },
})
