import type { Request, Response, NextFunction } from "express"

export function handle500(
  err: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) {
  console.error("Error:", err)

  res.status(500).json({ error: "Internal Server Error" })
}
