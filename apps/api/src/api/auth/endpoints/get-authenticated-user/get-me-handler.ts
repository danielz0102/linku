import type { LinkuAPI } from "@linku/api-contract"
import type { RequestHandler } from "express"

import type { GetAuthenticatedUser } from "#core/use-cases/get-authenticated-user-use-case.js"

type GetMeHandler = (
  getUser: GetAuthenticatedUser
) => RequestHandler<never, LinkuAPI.GetMe["ResponseBody"]>

export const getMeHandler: GetMeHandler = (getUser) => async (req, res) => {
  const { userId } = req.session

  if (!userId) {
    throw new Error("User ID not found in session")
  }

  const user = await getUser.execute(userId)
  return res.json(user)
}
