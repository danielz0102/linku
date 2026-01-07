import type { NextFunction, Request, Response } from "express"

export async function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.sendStatus(401)
  }

  const token = authHeader.split(" ")[1]

  if (!token) {
    return res.sendStatus(401)
  }

  req.token = token

  next()
}
