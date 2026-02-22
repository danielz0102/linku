import dotenv from "dotenv"
import z from "zod"

dotenv.config({
  quiet: true,
  override: true,
  path: process.env["ENV_PATH"],
})

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  ALLOWED_ORIGIN: z.url(),
  DATABASE_URL: z.url(),
  SALT: z.coerce.number().default(15),

  REDIS_URL: z.url(),
  SESSION_SECRET: z.string(),
  SESSION_MAX_AGE: z.coerce.number().default(1000 * 60 * 60 * 24 * 30),
  SESSION_SECURE: z.coerce.boolean().default(true),

  CLOUDINARY_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),

  RATE_LIMIT_ENABLED: z.coerce.boolean().default(true),
})

export const {
  PORT,
  ALLOWED_ORIGIN,
  DATABASE_URL,
  SALT,

  REDIS_URL,
  SESSION_SECRET,
  SESSION_MAX_AGE,
  SESSION_SECURE,

  CLOUDINARY_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,

  RATE_LIMIT_ENABLED,
} = envSchema.parse(process.env)
