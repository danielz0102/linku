import type { ErrorBody } from "@linku/api-contract"
import type { RequestHandler } from "express"

export const onlyAuth: RequestHandler<never, ErrorBody> = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({
      code: "UNAUTHORIZED",
      message: "You must be logged in to access this resource",
    })
  }

  next()
}
