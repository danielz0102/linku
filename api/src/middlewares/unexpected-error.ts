import type { ErrorBody } from "#types.d.js"
import type { Request, Response, NextFunction } from "express"

export const unexpectedError = (
  err: unknown,
  _req: Request,
  res: Response<ErrorBody>,
  _next: NextFunction
) => {
  console.error(err)
  res.status(500).json({
    code: "UNEXPECTED_ERROR",
    message: "An unexpected error occurred. Please try again later.",
  })
}
