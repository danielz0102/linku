import { SESSION_COOKIE_NAME } from "#shared/constants/session.js"
import type { ErrorBody } from "api-contract"
import type { Request, Response } from "express"

export const logoutHandler = (req: Request, res: Response<ErrorBody>) => {
  req.session.destroy((error) => {
    if (error) {
      console.error("Error destroying session during logout:", error)

      return res.status(500).json({
        code: "UNEXPECTED_ERROR",
        message: "An unexpected error occurred while logging out.",
      })
    }

    res.clearCookie(SESSION_COOKIE_NAME)
    return res.sendStatus(204)
  })
}
