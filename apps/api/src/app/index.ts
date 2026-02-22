import express from "express"
import { corsMiddleware } from "./middlewares/cors-middleware.js"
import { notFound } from "./middlewares/not-found.js"
import { sessionMiddleware } from "./middlewares/session-middleware.js"
import { unexpectedError } from "./middlewares/unexpected-error.js"
import { router } from "./router.js"

export function createApp() {
  const app = express()

  app.set("trust proxy", 1)

  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(corsMiddleware)
  app.use(sessionMiddleware)

  app.use(router)

  app.use(notFound)
  app.use(unexpectedError)

  return app
}
