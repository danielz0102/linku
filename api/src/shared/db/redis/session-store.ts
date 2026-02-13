import { SESSION_MAX_AGE } from "#shared/config/env.js"
import { RedisStore } from "connect-redis"
import redisClient from "./index.js"

export const redisStore = new RedisStore({
  client: redisClient,
  ttl: SESSION_MAX_AGE / 1000,
})
