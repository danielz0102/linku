import type { ErrorBody } from "api-contract"
import { rateLimit } from "express-rate-limit"

export const loginRateLimit = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    code: "TOO_MANY_REQUESTS",
    message: "Too many login attempts. Please try again later.",
  } satisfies ErrorBody,
})
