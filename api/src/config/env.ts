import z from "zod"

process.loadEnvFile()

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  ALLOWED_ORIGIN: z.url(),
})

export const { PORT, ALLOWED_ORIGIN } = envSchema.parse(process.env)
