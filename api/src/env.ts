import { env, loadEnvFile } from "node:process"

import { z } from "zod"

const areEnvVarsLoaded = env["PORT"] !== undefined

if (!areEnvVarsLoaded) {
  loadEnvFile(getEnvPath())
}

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  CLIENT_ORIGIN: z.url(),
  DB_URL: z.url(),
  SALT: z.coerce.number().default(15),
  RATE_LIMIT_ENABLED: z.stringbool().default(true),
  NODE_ENV: z.enum(["development", "production"]).default("development"),

  REDIS_URL: z.url(),
  SESSION_SECRET: z.string().min(32),
  SESSION_COOKIE_IS_SECURE: z.stringbool().default(true),

  CLOUDINARY_NAME: z.string().nonempty(),
  CLOUDINARY_API_KEY: z.string().nonempty(),
  CLOUDINARY_SECRET: z.string().nonempty(),
})

export const {
  PORT,
  CLIENT_ORIGIN,
  DB_URL,
  SALT,
  RATE_LIMIT_ENABLED,

  REDIS_URL,
  SESSION_SECRET,
  SESSION_COOKIE_IS_SECURE,

  CLOUDINARY_API_KEY,
  CLOUDINARY_SECRET,
  CLOUDINARY_NAME,
} = envSchema.parse(process.env)

function getEnvPath() {
  if (env["ENV_PATH"]) {
    return env["ENV_PATH"]
  }

  return ".env"
}
