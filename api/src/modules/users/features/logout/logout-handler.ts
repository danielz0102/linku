import type { Request, Response } from "express"

export const logoutHandler = (req: Request, res: Response) => {
  req.session.destroy((error) => {
    if (error) {
      return res.sendStatus(500)
    }

    res.clearCookie("connect.sid")
    return res.sendStatus(204)
  })
}
