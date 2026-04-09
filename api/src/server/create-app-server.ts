import * as trpcExpress from "@trpc/server/adapters/express"
import express from "express"

import { redisClient } from "../db/redis/redis-client.ts"
import { createContext } from "../shared/trpc.ts"
import { appRouter } from "./app-router.ts"
import { corsMiddleware } from "./middlewares/cors-middleware.ts"
import { sessionMiddleware } from "./middlewares/session-middleware.ts"

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
