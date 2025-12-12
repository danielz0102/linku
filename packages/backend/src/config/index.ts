import dotenv from "dotenv"
import z from "zod"

dotenv.config()

const configSchema = z.object({
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  CLIENT_ORIGIN: z.url().default("*"),
})

export const { PORT, NODE_ENV, CLIENT_ORIGIN } = configSchema.parse(process.env)
