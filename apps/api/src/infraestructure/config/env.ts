import z from "zod"
import dotenv from "dotenv"

const envFile = process.env["VITEST"] ? ".env.test" : ".env"
dotenv.config({ path: envFile, override: true, quiet: true })

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  DB_URL: z.url(),
  ALLOWED_ORIGIN: z.url(),
  SALT: z.coerce.number().default(10),
  JWT_SECRET: z.string().min(32),
  COOKIE_HTTPS_ONLY: z.coerce.boolean(),
  CLOUDINARY_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),
})

export const {
  PORT,
  DB_URL,
  ALLOWED_ORIGIN,
  SALT,
  JWT_SECRET,
  COOKIE_HTTPS_ONLY,
  CLOUDINARY_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = envSchema.parse(process.env)
