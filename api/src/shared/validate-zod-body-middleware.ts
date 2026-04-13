import type { RequestHandler } from "express"
import type { ZodType } from "zod"

export function validateZodBodyMiddleware<TOutput>(
  schema: ZodType<TOutput>
): RequestHandler {
  return (req, res, next) => {
    const parsedBody = schema.safeParse(req.body)

    if (!parsedBody.success) {
      res.status(400).json({
        message: "Invalid request body",
        errors: parsedBody.error.issues,
      })
      return
    }

    req.body = parsedBody.data
    next()
  }
}
