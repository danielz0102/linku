import { createClient } from "redis"

import { REDIS_URL } from "#env.ts"

export const redisClient = createClient({ url: REDIS_URL })

await redisClient.connect()

redisClient.on("error", (error) => {
  console.error("Redis client error", error)
})
