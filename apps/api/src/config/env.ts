import { loadEnvFile } from "node:process"
import z from "zod"

loadEnvFile()

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  DB_URL: z.url(),
  ALLOWED_ORIGIN: z.url(),
  SALT: z.coerce.number().default(10),
  JWT_SECRET: z.string().min(32),
})

export const { PORT, DB_URL, ALLOWED_ORIGIN, SALT, JWT_SECRET } =
  envSchema.parse(process.env)
