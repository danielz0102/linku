import { rateLimit } from "express-rate-limit"
import { RedisStore } from "rate-limit-redis"

import { redisClient } from "#db/redis/redis-client.ts"

const loginRateLimitStore = new RedisStore({
  sendCommand: (...args: string[]) => redisClient.sendCommand(args),
})

export const loginRateLimitMiddleware = rateLimit({
  windowMs: 1000 * 60 * 5,
  limit: 5,
  store: loginRateLimitStore,
  message: "Too many attempts. Try again later",
})
