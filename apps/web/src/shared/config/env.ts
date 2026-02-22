import { z } from "zod/mini"

const envSchema = z.object({
  VITE_API_URL: z.url(),
})

export const { VITE_API_URL: API_URL } = envSchema.parse(import.meta.env)
