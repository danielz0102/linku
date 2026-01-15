import { loadEnvFile } from "node:process"
import z from "zod"

loadEnvFile()

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  DB_URL: z.url(),
  ALLOWED_ORIGIN: z.url(),
})

export const { PORT, DB_URL, ALLOWED_ORIGIN } = envSchema.parse(process.env)
