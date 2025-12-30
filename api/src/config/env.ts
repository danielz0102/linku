import dotenv from "dotenv"
import z from "zod"

dotenv.config({ quiet: true })

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().default(3000),
  CLIENT_ORIGIN: z.url(),
})

export const { NODE_ENV, PORT, CLIENT_ORIGIN } = envSchema.parse(process.env)
