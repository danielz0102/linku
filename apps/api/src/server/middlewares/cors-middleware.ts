import cors from "cors"

import { ALLOWED_ORIGIN } from "#env.js"

export const corsMiddleware = cors({
  origin: ALLOWED_ORIGIN,
  credentials: true,
})
