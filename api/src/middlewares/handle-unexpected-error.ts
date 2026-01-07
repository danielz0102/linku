import type { NextFunction, Request, Response } from "express"

export function handleUnexpectedError(
  err: Error,
  _r: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _n: NextFunction
) {
  console.error(err)
  res.sendStatus(500)
}
