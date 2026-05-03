/// <reference types="node" />
import { env } from "node:process"

import dotenv from "dotenv"
import { defineConfig } from "drizzle-kit"

// Drizzle-kit loads `.env` file by default
// To load a custom path (e.g., `.env.test`), overriding the default env vars is needed
// This is not possible with the native `process.loadEnvFile`, so `dotenv` package is used instead
dotenv.config({ path: env["ENV_PATH"] ?? ".env", override: true, quiet: true })

const dbUrl = env["DB_URL"]
console.log("Database URL:", dbUrl)

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/drizzle/schemas.ts",
  dialect: "postgresql",
  dbCredentials: { url: dbUrl! },
})
