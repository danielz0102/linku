import { loadEnvFile } from "node:process"
import z from "zod"

loadEnvFile()

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
})

export const { PORT } = envSchema.parse(process.env)
