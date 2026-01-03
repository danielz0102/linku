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
})

export const { NODE_ENV, PORT, CLIENT_ORIGIN, GOOGLE_OAUTH_CLIENT_ID, DB_URL } =
  envSchema.parse(process.env)
