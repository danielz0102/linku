import type { LinkuAPI } from "@linku/api-contract"
import type { Request, Response } from "express"

export const notFound = (_: Request, res: Response<LinkuAPI.ErrorBody>) => {
  res.status(404).json({
    code: "NOT_FOUND",
    message: "The requested resource was not found.",
  })
}
