import type { UserRepository } from "#users/application/ports/user-repository.d.js"
import type { LinkuAPI } from "@linku/api-contract"
import type { RequestHandler } from "express"

type GetUsersHandler = (
  repository: UserRepository
) => RequestHandler<
  never,
  LinkuAPI.GetUsers["ResponseBody"],
  never,
  LinkuAPI.GetUsers["Query"]
>

export const getUsersHandler: GetUsersHandler =
  (repository) => async (req, res) => {
    const { username, firstName, lastName, limit = 20, offset = 0 } = req.query

    const users = await repository.search(
      { username, firstName, lastName },
      { limit: Number(limit), offset: Number(offset) }
    )

    return res.status(200).json(users.map((u) => u.toPublic()))
  }
