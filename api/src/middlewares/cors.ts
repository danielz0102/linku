import cors from "cors"
import { CLIENT_ORIGIN } from "~/config/env.js"

export const corsMiddleware = cors({
  origin: CLIENT_ORIGIN,
  credentials: true,
})
