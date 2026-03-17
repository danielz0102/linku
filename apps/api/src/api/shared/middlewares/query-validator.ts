import type { LinkuAPI } from "@linku/api-contract"
import type { RequestHandler } from "express"

import { z } from "zod"

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

    const firstError = v.errors[0]

    if (!firstError) {
      return acc
    }

    acc[k] = firstError
    return acc
  }, {})
}
