import { toPrivateUser } from "#users/application/dtos/user-mapper.js"
import type { UserRepository } from "#users/domain/user-repository.js"
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

    const users = await repository.matching({
      conjunction: "OR",
      filters: {
        username: username ? { value: username, op: "ILIKE" } : undefined,
        firstName: firstName ? { value: firstName, op: "ILIKE" } : undefined,
        lastName: lastName ? { value: lastName, op: "ILIKE" } : undefined,
      },
      limit: Number(limit),
      offset: Number(offset),
    })

    return res.status(200).json(users.map((u) => toPrivateUser(u)))
  }
