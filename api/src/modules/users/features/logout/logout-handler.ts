import { SESSION_COOKIE_NAME } from "#shared/constants/session.js"
import type { Request, Response } from "express"

export const logoutHandler = (req: Request, res: Response) => {
  req.session.destroy((error) => {
    if (error) {
      return res.sendStatus(500)
    }

    res.clearCookie(SESSION_COOKIE_NAME)
    return res.sendStatus(204)
  })
}
