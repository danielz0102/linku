import { createClient } from "redis"

import { REDIS_URL } from "#env.js"

const redisClient = createClient({ url: REDIS_URL })

redisClient.on("error", (error) => {
  console.error("Redis Client Error", error)
})

await redisClient.connect()

export { redisClient }
