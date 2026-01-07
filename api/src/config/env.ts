import dotenv from "dotenv"
import z from "zod"

dotenv.config({ quiet: true })

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().default(3000),
  CLIENT_ORIGIN: z.url(),
  GOOGLE_OAUTH_CLIENT_ID: z.string(),
  DB_URL: z.url(),
  TEST_DB_URL: z.url(),
  JWT_SECRET: z.string(),
})

export const {
  NODE_ENV,
  PORT,
  CLIENT_ORIGIN,
  GOOGLE_OAUTH_CLIENT_ID,
  DB_URL,
  TEST_DB_URL,
  JWT_SECRET,
} = envSchema.parse(process.env)
