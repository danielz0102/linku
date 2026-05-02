import { createServer } from "node:http"

import express from "express"

import { corsMiddleware } from "./middlewares/cors-middleware.ts"
import { notFoundMiddleware } from "./middlewares/not-found-middleware.ts"
import { sessionMiddleware } from "./middlewares/session-middleware.ts"
import { unexpectedErrorMiddleware } from "./middlewares/unexpected-error-middleware.ts"
import { appRouter } from "./routers/app-router.ts"

export function createAppServer() {
  const app = express()
  const server = createServer(app)

  app.use(express.json())
  app.set("trust proxy", 1)

  app.use(corsMiddleware)
  app.use(sessionMiddleware)

  app.use(appRouter)

  app.use(notFoundMiddleware)
  app.use(unexpectedErrorMiddleware)

  return server
}
