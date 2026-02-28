import { SESSION_COOKIE_NAME } from "#shared/constants/session.js"
import type { LinkuAPI } from "@linku/api-contract"
import type { RequestHandler } from "express"

export const logoutHandler: RequestHandler<
  never,
  LinkuAPI.Logout["ResponseBody"]
> = (req, res) => {
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
