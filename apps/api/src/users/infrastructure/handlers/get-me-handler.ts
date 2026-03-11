import { Criteria, Filter } from "#shared/domain/criteria.js"
import type { UserRepository } from "#users/application/ports/user-repository.d.js"
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

  const [userFound] = await repository.matching(
    new Criteria({ filters: [new Filter("id", "eq", userId)], limit: 1 })
  )

  if (!userFound) {
    throw new Error("User with session not found in database", {
      cause: { id: userId },
    })
  }

  return res.json({
    id: userFound.id,
    username: userFound.username,
    email: userFound.email,
    firstName: userFound.firstName,
    lastName: userFound.lastName,
    bio: userFound.bio,
    profilePicUrl: userFound.profilePicUrl,
  })
}
