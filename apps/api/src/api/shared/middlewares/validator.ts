import type { LinkuAPI } from "@linku/api-contract"
import type { RequestHandler } from "express"

import { z } from "zod"

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

function mapZodError(
  error: z.ZodError<Record<string, unknown>>
): Record<string, string> | undefined {
  const { properties } = z.treeifyError(error)

  if (!properties) {
    return
  }

  return Object.entries(properties).reduce<Record<string, string>>((acc, [k, v]) => {
    if (!v) {
      return acc
    }

    return {
      ...acc,
      [k]: v.errors[0],
    }
  }, {})
}
