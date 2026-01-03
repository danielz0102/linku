import { defineConfig } from "drizzle-kit"
import { DB_URL } from "./src/config/env"

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/drizzle/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: DB_URL,
  },
})
