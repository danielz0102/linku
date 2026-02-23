import type { UserRepository } from "#users/interfaces/user-repository.d.js"
import type { ErrorBody, PublicUser } from "@linku/api-contract"
import type { RequestHandler } from "express"

type MeHandler = (
  repository: UserRepository
) => RequestHandler<never, PublicUser | ErrorBody>

export const meHandler: MeHandler = (repository) => async (req, res) => {
  const { userId } = req.session

  if (!userId) {
    throw new Error("User ID not found in session")
  }

  const userFound = await repository.search({ id: userId })

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
