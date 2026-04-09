import { z } from "zod"

process.loadEnvFile()

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  CLIENT_ORIGIN: z.url(),
  DB_URL: z.url(),
})

export const { PORT, CLIENT_ORIGIN, DB_URL } = envSchema.parse(process.env)
