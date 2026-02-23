import type { ErrorBody } from "@linku/api-contract"
import { rateLimit } from "express-rate-limit"

const body: ErrorBody = {
  code: "TOO_MANY_REQUESTS",
  message: "Too many login attempts. Please try again later.",
}

export const loginRateLimit = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: body,
})
