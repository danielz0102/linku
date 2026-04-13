import express from "express"

import { redisClient } from "#db/redis/redis-client.ts"

import { corsMiddleware } from "./middlewares/cors-middleware.ts"
import { sessionMiddleware } from "./middlewares/session-middleware.ts"
import { trpcMiddleware } from "./middlewares/trpc-middleware.ts"

export const createAppServer = async () => {
  const app = express()

  app.set("trust proxy", 1)

  await redisClient.connect()

  app.use(corsMiddleware)
  app.use(sessionMiddleware)
  app.use("/trpc", trpcMiddleware)

  return app
}
