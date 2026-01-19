import { DB_URL } from "#infraestructure/config/env.js"
import { defineConfig } from "drizzle-kit"

console.log("Using DB URL:", DB_URL)

export default defineConfig({
  out: "./drizzle",
  schema: "./src/infraestructure/db/drizzle/schemas.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: DB_URL,
  },
})
