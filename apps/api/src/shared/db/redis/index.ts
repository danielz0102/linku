import { REDIS_URL } from "#shared/config/env.js"
import { createClient } from "redis"

const redisClient = createClient({ url: REDIS_URL })

redisClient.on("error", (error) => {
  console.error("Redis Client Error", error)
})

await redisClient.connect()

export default redisClient
