import type { ErrorBody } from "@linku/api-contract"
import type { RequestHandler } from "express"
import z from "zod"

type Validator = (schema: z.ZodObject) => RequestHandler<never, ErrorBody>

export const validator: Validator = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body)

  if (!result.success) {
    const errors = mapZodError(result.error)

    return res.status(400).json({
      code: "VALIDATION_ERROR",
      message: "Invalid data",
      errors,
    })
  }

  next()
}

function mapZodError(
  error: z.ZodError<Record<string, unknown>>
): Record<string, string> | undefined {
  const flattened = z.treeifyError(error).properties

  if (!flattened) {
    return
  }

  const result = Object.entries(flattened).reduce<Record<string, string>>(
    (acc, [k, v]) => {
      if (!v) {
        return acc
      }

      return {
        ...acc,
        [k]: v.errors[0],
      }
    },
    {}
  )

  return result
}
