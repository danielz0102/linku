import { Criteria, Filter } from "#shared/domain/criteria.js"
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

    const filters = [
      username ? new Filter("username", "ilike", username) : null,
      firstName ? new Filter("firstName", "ilike", firstName) : null,
      lastName ? new Filter("lastName", "ilike", lastName) : null,
    ].filter((f): f is Filter => f !== null)

    const users = await repository.matching(
      new Criteria({
        filters,
        filterType: "OR",
        limit: Number(limit),
        offset: Number(offset),
      })
    )

    return res.status(200).json(users.map((u) => u.toPublic()))
  }
