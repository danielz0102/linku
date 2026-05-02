import type { RequestHandler } from "express"

export const enrichMiddleware: RequestHandler = (_, res, next) => {
  res.sendValidationError = function (details) {
    return this.status(400).json({ message: "Invalid request", details })
  }

  next()
}
