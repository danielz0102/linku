import type { Request, Response } from "express"

export function handleNotFound(_: Request, res: Response) {
  res.sendStatus(404)
}
