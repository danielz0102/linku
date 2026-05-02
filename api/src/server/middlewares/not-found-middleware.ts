import type { RequestHandler } from "express"

export const notFoundMiddleware: RequestHandler = (_, res) => {
  res.sendStatus(404)
}
