import dotenv from "dotenv"
import z from "zod"

dotenv.config({ quiet: true, override: true })

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
} = envSchema.parse(process.env)
