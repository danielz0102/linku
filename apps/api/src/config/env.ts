import z from "zod"

const envFile = process.env["VITEST"] ? ".env.test" : ".env"
process.loadEnvFile(envFile)

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  DB_URL: z.url(),
  ALLOWED_ORIGIN: z.url(),
  SALT: z.coerce.number().default(10),
  JWT_SECRET: z.string().min(32),
  COOKIE_HTTPS_ONLY: z.coerce.boolean(),
})

export const {
  PORT,
  DB_URL,
  ALLOWED_ORIGIN,
  SALT,
  JWT_SECRET,
  COOKIE_HTTPS_ONLY,
} = envSchema.parse(process.env)
