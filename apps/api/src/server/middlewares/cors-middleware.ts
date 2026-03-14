import { ALLOWED_ORIGIN } from "#env.js"
import cors from "cors"

export const corsMiddleware = cors({
  origin: ALLOWED_ORIGIN,
  credentials: true,
})
