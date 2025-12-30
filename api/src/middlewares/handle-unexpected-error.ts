import type { NextFunction, Request, Response } from "express"
import logger from "~/services/logger.js"

export function handleUnexpectedError(
  err: Error,
  _r: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _n: NextFunction
) {
  logger.error(err)
  res.sendStatus(500)
}
