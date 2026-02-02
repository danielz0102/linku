import dotenv from "dotenv"
import z from "zod"

dotenv.config({ quiet: true, override: true })

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  ALLOWED_ORIGIN: z.url(),
  DATABASE_URL: z.url(),
  SALT: z.coerce.number().default(15),
  CLOUDINARY_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),
})

export const {
  PORT,
  ALLOWED_ORIGIN,
  DATABASE_URL,
  SALT,
  CLOUDINARY_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = envSchema.parse(process.env)
