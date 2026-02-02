import type { Request, Response, NextFunction } from "express"
import { z, type ZodObject } from "zod"

export const validate =
  (schema: ZodObject) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req)

    if (!result.success) {
      return res.status(400).json(z.treeifyError(result.error))
    }

    next()
  }
