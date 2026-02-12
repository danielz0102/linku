import { REDIS_URL } from "#config/env.js"
import { createClient } from "redis"

const redisClient = createClient({ url: REDIS_URL })

redisClient.on("error", (error) => {
  console.error("Redis Client Error", error)
})

redisClient.connect().catch((error) => {
  console.error("Redis connection error", error)
})

export default redisClient
