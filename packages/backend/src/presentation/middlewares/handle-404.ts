import type { Request, Response, NextFunction } from "express"

export function handle404(
  err: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) {
  res.sendStatus(404)
}
