import { ALLOWED_ORIGIN } from "#config/env.js"
import cors from "cors"

export const checkOrigin = cors({
  origin: ALLOWED_ORIGIN,
})
