import * as z from "zod/mini"

export const envSchema = z.object({
  VITE_API_URL: z.url(),
  VITE_SOCKET_URL: z.url(),
})

export const { VITE_API_URL: API_URL, VITE_SOCKET_URL: SOCKET_URL } = envSchema.parse(
  import.meta.env
)
