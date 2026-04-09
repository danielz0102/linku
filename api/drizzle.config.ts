import { defineConfig } from "drizzle-kit"

import { DB_URL } from "./src/env.ts"

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/drizzle/schemas.ts",
  dialect: "postgresql",
  dbCredentials: { url: DB_URL },
})
