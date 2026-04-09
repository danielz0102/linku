import cors from "cors"

import { CLIENT_ORIGIN } from "../env.ts"

export const corsMiddleware = cors({
  origin: CLIENT_ORIGIN,
  credentials: true,
})
