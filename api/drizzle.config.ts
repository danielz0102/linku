import { defineConfig } from "drizzle-kit"
import { DATABASE_URL } from "./src/config/env.ts"

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/drizzle/schemas.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: DATABASE_URL,
  },
})
