import { env, loadEnvFile } from "node:process"

import { z } from "zod"

loadEnvFile(env["VITEST"] ? ".env.test" : ".env")

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  CLIENT_ORIGIN: z.url(),
  DB_URL: z.url(),
  SALT: z.coerce.number().default(15),

  REDIS_URL: z.url(),
  SESSION_SECRET: z.string().min(32),
  SESSION_COOKIE_IS_HTTPS: z.coerce.boolean().default(true),

  CLOUDINARY_NAME: z.string().nonempty(),
  CLOUDINARY_API_KEY: z.string().nonempty(),
  CLOUDINARY_SECRET: z.string().nonempty(),
})

export const {
  PORT,
  CLIENT_ORIGIN,
  DB_URL,
  SALT,

  REDIS_URL,
  SESSION_SECRET,
  SESSION_COOKIE_IS_HTTPS,

  CLOUDINARY_API_KEY,
  CLOUDINARY_SECRET,
  CLOUDINARY_NAME,
} = envSchema.parse(process.env)
