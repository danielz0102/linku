import z from "zod"

export const envSchema = z.object({
  VITE_API_URL: z.url(),
  VITE_GOOGLE_OAUTH_CLIENT_ID: z.string().nonempty(),
  VITE_GOOGLE_STATE_SECRET: z.string().nonempty(),
})

export const {
  VITE_GOOGLE_OAUTH_CLIENT_ID: GOOGLE_OAUTH_CLIENT_ID,
  VITE_API_URL: API_URL,
  VITE_GOOGLE_STATE_SECRET: GOOGLE_STATE_SECRET,
} = envSchema.parse(import.meta.env)
