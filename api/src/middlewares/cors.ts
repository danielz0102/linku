import cors, { type CorsOptions } from "cors"
import { CLIENT_ORIGIN, NODE_ENV } from "~/config/env.js"

export const corsMiddleware = cors({
  origin: getAllowedOrigin(),
})

function getAllowedOrigin(): CorsOptions["origin"] {
  if (NODE_ENV === "production") {
    return CLIENT_ORIGIN
  }

  return "*"
}
