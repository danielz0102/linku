import { RedisStore } from "connect-redis"

import { SESSION_MAX_AGE } from "#env.js"

import { redisClient } from "./redis-client.js"

export const redisStore = new RedisStore({
  client: redisClient,
  ttl: SESSION_MAX_AGE / 1000,
})
