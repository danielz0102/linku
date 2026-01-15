import { checkOrigin } from "#middlewares/check-origin.js"
import { handleUnexpectedError } from "#middlewares/handle-error.js"
import { handleNotFound } from "#middlewares/handle-not-found.js"
import express, { type Router } from "express"

export function createApp(apiRouter: Router) {
  const app = express()

  app.use(checkOrigin)
  app.use(express.json())

  app.use("/api", apiRouter)
  app.use(handleNotFound)
  app.use(handleUnexpectedError)

  return app
}
