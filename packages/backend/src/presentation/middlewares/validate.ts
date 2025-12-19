import type { NextFunction, Request, Response } from "express"
import z from "zod"

export const validate =
  (schema: z.ZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req)

    if (!result.success) {
      const errors = z.treeifyError(result.error)
      return res.status(400).json(errors)
    }

    next()
  }
