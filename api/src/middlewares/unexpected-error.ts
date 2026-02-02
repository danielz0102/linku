import type { ErrorRequestHandler } from "express"

export const unexpectedError: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err)
  res.sendStatus(500)
}
