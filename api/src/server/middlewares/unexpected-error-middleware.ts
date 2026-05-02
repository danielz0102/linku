import type { ErrorRequestHandler } from "express"

export const unexpectedErrorMiddleware: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error("Unexpected error:", err)
  res.status(500).json({ message: "An unexpected error occurred. Try again later." })
}
