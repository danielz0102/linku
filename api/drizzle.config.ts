import { defineConfig } from "drizzle-kit"
import { DB_URL, NODE_ENV, TEST_DB_URL } from "./src/config/env"

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/drizzle/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: NODE_ENV === "test" ? TEST_DB_URL : DB_URL,
  },
})
