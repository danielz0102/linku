import type { UserRepository } from "#users/application/ports/user-repository.d.js"
import type { LinkuAPI } from "@linku/api-contract"
import type { RequestHandler } from "express"

type GetUsersHandler = (
  repository: UserRepository
) => RequestHandler<never, LinkuAPI.GetUsers["ResponseBody"]>

export const getUsersHandler: GetUsersHandler =
  (repository) => async (req, res) => {
    const { username, firstName, lastName, limit, offset } =
      req.query as LinkuAPI.GetUsers["Query"]

    const filters = {
      ...(username ? { username } : {}),
      ...(firstName ? { firstName } : {}),
      ...(lastName ? { lastName } : {}),
    }

    const users = await repository.search(filters, {
      limit: limit !== undefined ? Number(limit) : undefined,
      offset: offset !== undefined ? Number(offset) : undefined,
    })

    return res.status(200).json(
      users.map((user) => ({
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        bio: user.bio,
        profilePicUrl: user.profilePicUrl,
      }))
    )
  }
