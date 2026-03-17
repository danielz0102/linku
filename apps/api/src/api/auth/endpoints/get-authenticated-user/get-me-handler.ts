import type { LinkuAPI } from "@linku/api-contract"
import type { RequestHandler } from "express"

import type { GetAuthenticatedUser } from "#core/use-cases/get-authenticated-user-use-case.js"

import { SESSION_COOKIE_NAME } from "#api/auth/constants/session.js"

type GetMeHandler = (
  getUser: GetAuthenticatedUser
) => RequestHandler<never, LinkuAPI.GetMe["ResponseBody"]>

export const getMeHandler: GetMeHandler = (getUser) => async (req, res) => {
  const { userId } = req.session

  if (!userId) {
    throw new Error("User ID not found in session")
  }

  try {
    const user = await getUser.execute(userId)
    res.json(user)
  } catch {
    console.log("Error retrieving authenticated user. Destroying session and clearing cookie")

    req.session.destroy((e) => {
      if (e) {
        console.error("Error destroying session", e)
      }

      res.clearCookie(SESSION_COOKIE_NAME)
      res.status(500).json({
        code: "UNEXPECTED_ERROR",
        message: "An unexpected error occurred while retrieving the authenticated user.",
      })
    })
  }
}
