import { env, loadEnvFile } from "node:process"

import { z } from "zod"

loadEnvFile(env["VITEST"] ? ".env.test" : ".env")

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  CLIENT_ORIGIN: z.url(),
  DB_URL: z.url(),
  REDIS_URL: z.url(),
  SESSION_SECRET: z.string().min(32),
  SALT: z.coerce.number().default(15),
  COOKIE_HTTPS: z.coerce.boolean().default(true),
})

export const { PORT, CLIENT_ORIGIN, DB_URL, REDIS_URL, SESSION_SECRET, SALT, COOKIE_HTTPS } =
  envSchema.parse(process.env)
