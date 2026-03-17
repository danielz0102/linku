import type { LinkuAPI } from "@linku/api-contract"
import type { RequestHandler } from "express"

import type { GetUserByIdUseCase } from "#core/use-cases/get-user-by-id-use-case.js"

type GetUserByIdHandler = (
  getUser: GetUserByIdUseCase
) => RequestHandler<LinkuAPI.GetUserById["Params"], LinkuAPI.GetUserById["ResponseBody"]>

export const getUserByIdHandler: GetUserByIdHandler = (getUser) => async (req, res) => {
  const { id } = req.params

  const user = await getUser.execute(id)

  if (!user) {
    return res.status(404).json({
      code: "NOT_FOUND",
      message: "User not found",
    })
  }

  return res.status(200).json(user)
}
