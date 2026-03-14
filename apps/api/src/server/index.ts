import { sessionMiddleware } from "#api/auth/session-middleware.js"
import express from "express"

import { apiRouter } from "../api/api-router.js"
import { corsMiddleware } from "./middlewares/cors-middleware.js"
import { notFound } from "./middlewares/not-found.js"
import { unexpectedError } from "./middlewares/unexpected-error.js"

export function createApp() {
  const app = express()

  app.set("trust proxy", 1)

  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(corsMiddleware)
  app.use(sessionMiddleware)

  app.use(apiRouter)

  app.use(notFound)
  app.use(unexpectedError)

  return app
}
