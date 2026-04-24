import { createServer } from "node:http"

import express from "express"

import { corsMiddleware } from "./middlewares/cors-middleware.ts"
import { sessionMiddleware } from "./middlewares/session-middleware.ts"
import { appRouter } from "./routers/app-router.ts"

export const createAppServer = async () => {
  const app = express()
  const server = createServer(app)

  app.use(express.json())
  app.set("trust proxy", 1)

  app.use(corsMiddleware)
  app.use(sessionMiddleware)

  app.use(appRouter)

  return server
}
