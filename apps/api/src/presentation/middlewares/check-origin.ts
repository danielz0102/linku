import { ALLOWED_ORIGIN } from "#infraestructure/config/env.js"
import cors from "cors"

export const checkOrigin = cors({
  origin: ALLOWED_ORIGIN,
})
