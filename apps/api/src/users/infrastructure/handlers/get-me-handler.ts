import type { UserRepository } from "#users/domain/user-repository.js"
import type { LinkuAPI } from "@linku/api-contract"
import type { RequestHandler } from "express"

import { UUID } from "#shared/domain/uuid.js"
import { toPublicUser } from "#users/application/dtos/user-mapper.js"

type GetMeHandler = (
  repository: UserRepository
) => RequestHandler<never, LinkuAPI.GetMe["ResponseBody"]>

export const getMeHandler: GetMeHandler = (repository) => async (req, res) => {
  const { userId } = req.session

  if (!userId) {
    throw new Error("User ID not found in session")
  }

  const userFound = await repository.findExisting({ id: new UUID(userId) })

  if (!userFound) {
    throw new Error("User with session not found in database", {
      cause: { id: userId },
    })
  }

  return res.json(toPublicUser(userFound))
}
