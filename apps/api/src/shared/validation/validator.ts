import type { LinkuAPI } from "@linku/api-contract"
import type { RequestHandler } from "express"

import { z } from "zod"

import { mapZodError } from "../validation/map-zod-error.js"

type Validator = (schema: z.ZodObject) => RequestHandler<never, LinkuAPI.ErrorBody>

export const validator: Validator = (schema) => (req, res, next) => {
  const { success, error, data } = schema.safeParse(req.body)

  if (!success) {
    return res.status(400).json({
      code: "VALIDATION_ERROR",
      message: "Invalid data",
      errors: mapZodError(error),
    })
  }

  req.body = data
  next()
}
