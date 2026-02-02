import type { RequestHandler } from "express"
import { z } from "zod"

export const validate =
  (schema: z.ZodObject): RequestHandler =>
  (req, res, next) => {
    const result = schema.safeParse(req)

    if (!result.success) {
      return res.status(400).json(z.treeifyError(result.error))
    }

    next()
  }
