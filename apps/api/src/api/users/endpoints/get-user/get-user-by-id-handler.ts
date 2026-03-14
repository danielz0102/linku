import type { UserRepository } from "#core/users/user-repository.js"
import type { LinkuAPI } from "@linku/api-contract"
import type { RequestHandler } from "express"

import { toPublicUser } from "#core/use-cases/dtos/public-user.js"
import { UUID } from "#core/uuid.js"

type GetUserByIdHandler = (
  repository: UserRepository
) => RequestHandler<LinkuAPI.GetUserById["Params"], LinkuAPI.GetUserById["ResponseBody"]>

export const getUserByIdHandler: GetUserByIdHandler = (repository) => async (req, res) => {
  const { id } = req.params

  const user = await repository.findExisting({ id: new UUID(id) })

  if (!user) {
    return res.status(404).json({
      code: "NOT_FOUND",
      message: "User not found",
    })
  }

  return res.status(200).json(toPublicUser(user))
}
