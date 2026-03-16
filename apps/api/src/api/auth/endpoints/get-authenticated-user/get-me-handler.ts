import type { LinkuAPI } from "@linku/api-contract"
import type { RequestHandler } from "express"

import type { UserRepository } from "#core/users/user-repository.js"

import { toPublicUser } from "#core/use-cases/dtos/public-user.js"
import { UUID } from "#core/uuid.js"

type GetMeHandler = (
  repository: UserRepository
) => RequestHandler<never, LinkuAPI.GetMe["ResponseBody"]>

export const getMeHandler: GetMeHandler = (repository) => async (req, res) => {
  const { userId } = req.session

  if (!userId) {
    throw new Error("User ID not found in session")
  }

  const userFound = await repository.findOne({ id: new UUID(userId) })

  if (!userFound) {
    throw new Error("User with session not found in database", {
      cause: { id: userId },
    })
  }

  return res.json(toPublicUser(userFound))
}
