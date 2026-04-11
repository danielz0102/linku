import * as trpcExpress from "@trpc/server/adapters/express"
import express from "express"

import { redisClient } from "#db/redis/redis-client.ts"
import { appRouter } from "#server/app-router.ts"
import { corsMiddleware } from "#server/middlewares/cors-middleware.ts"
import { sessionMiddleware } from "#server/middlewares/session-middleware.ts"
import { createContext } from "#shared/trpc.ts"

export const createAppServer = async () => {
  const app = express()

  app.set("trust proxy", 1)

  await redisClient.connect()

  app.use(corsMiddleware)
  app.use(sessionMiddleware)

  app.use(
    "/trpc",
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  )

  return app
}
