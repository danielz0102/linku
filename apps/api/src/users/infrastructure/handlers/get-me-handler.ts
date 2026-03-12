import { toPrivateUser } from "#users/application/dtos/user-mapper.js"
import type { UserRepository } from "#users/domain/user-repository.js"
import type { LinkuAPI } from "@linku/api-contract"
import type { RequestHandler } from "express"

type GetMeHandler = (
  repository: UserRepository
) => RequestHandler<never, LinkuAPI.GetMe["ResponseBody"]>

export const getMeHandler: GetMeHandler = (repository) => async (req, res) => {
  const { userId } = req.session

  if (!userId) {
    throw new Error("User ID not found in session")
  }

  const [userFound] = await repository.matching({
    filters: { id: userId },
    limit: 1,
  })

  if (!userFound) {
    throw new Error("User with session not found in database", {
      cause: { id: userId },
    })
  }

  return res.json(toPrivateUser(userFound))
}
