import dotenv from "dotenv"
import z from "zod"

dotenv.config({ quiet: true, override: true })

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  ALLOWED_ORIGIN: z.url(),
  DATABASE_URL: z.url(),
})

export const { PORT, ALLOWED_ORIGIN, DATABASE_URL } = envSchema.parse(
  process.env
)
