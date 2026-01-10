import z from "zod"

process.loadEnvFile()

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("production"),
  PORT: z.coerce.number().default(3000),
  CLIENT_ORIGIN: z.url(),
  GOOGLE_OAUTH_CLIENT_ID: z.string().nonempty(),
  GOOGLE_OAUTH_CLIENT_SECRET: z.string().nonempty(),
  // GOOGLE_OAUTH_REDIRECT_URI: z.url(),
  DB_URL: z.url(),
  TEST_DB_URL: z.url(),
  JWT_SECRET: z.string().nonempty(),
})

export const {
  NODE_ENV,
  PORT,
  CLIENT_ORIGIN,
  GOOGLE_OAUTH_CLIENT_ID,
  GOOGLE_OAUTH_CLIENT_SECRET,
  // GOOGLE_OAUTH_REDIRECT_URI,
  DB_URL,
  TEST_DB_URL,
  JWT_SECRET,
} = envSchema.parse(process.env)
