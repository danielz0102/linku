import { defineConfig } from "drizzle-kit"
import { DATABASE_URL } from "./src/infraestructure/config/env"

export default defineConfig({
  out: "./drizzle",
  schema: "./src/infraestructure/db/drizzle/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: DATABASE_URL,
  },
})
