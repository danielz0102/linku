import type { LinkuAPI } from "@linku/api-contract"
import type { RequestHandler } from "express"

import { z } from "zod"

import { mapZodError } from "../validation/map-zod-error.js"

type QueryValidator = (schema: z.ZodObject) => RequestHandler<never, LinkuAPI.ErrorBody>

export const queryValidator: QueryValidator = (schema) => (req, res, next) => {
  const { success, error } = schema.safeParse(req.query)

  if (!success) {
    return res.status(400).json({
      code: "VALIDATION_ERROR",
      message: "Invalid query parameters",
      errors: mapZodError(error),
    })
  }

  next()
}
