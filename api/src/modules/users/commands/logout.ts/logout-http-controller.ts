import type { RequestHandler } from "express"

import { SESSION_COOKIE_IS_SECURE } from "#env.ts"
import { SESSION_COOKIE_NAME } from "#shared/session.ts"

export const logoutController: RequestHandler = async (req, res) => {
  if (!req.session.userId) return res.sendStatus(204)

  req.session.destroy((error) => {
    if (error) {
      console.error("Error destroying session:", error)
    }

    res.clearCookie(SESSION_COOKIE_NAME, {
      httpOnly: true,
      sameSite: SESSION_COOKIE_IS_SECURE ? "none" : "lax",
      secure: SESSION_COOKIE_IS_SECURE,
    })
    res.sendStatus(204)
  })
}
