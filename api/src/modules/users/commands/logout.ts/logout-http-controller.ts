import type { RequestHandler } from "express"

import { SESSION_COOKIE_NAME } from "#shared/session.ts"

export const logoutController: RequestHandler = async (req, res) => {
  if (!req.session.userId) return res.sendStatus(204)

  req.session.destroy((error) => {
    if (error) {
      console.error("Error destroying session:", error)
    }

    res.clearCookie(SESSION_COOKIE_NAME)
    res.sendStatus(204)
  })
}
