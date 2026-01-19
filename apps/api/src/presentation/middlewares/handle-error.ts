import type { NextFunction, Request, Response } from "express"

export function handleUnexpectedError(
  err: Error,
  _: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  __: NextFunction
) {
  console.error(err)
  res.status(500).json({ error: "Unexpected Error" })
}
