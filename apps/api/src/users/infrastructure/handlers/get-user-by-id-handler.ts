import { Criteria, Filter } from "#shared/domain/criteria.js"
import type { UserRepository } from "#users/application/ports/user-repository.d.js"
import type { LinkuAPI } from "@linku/api-contract"
import type { RequestHandler } from "express"

type GetUserByIdHandler = (
  repository: UserRepository
) => RequestHandler<
  LinkuAPI.GetUserById["Params"],
  LinkuAPI.GetUserById["ResponseBody"]
>

export const getUserByIdHandler: GetUserByIdHandler =
  (repository) => async (req, res) => {
    const { id } = req.params

    const [user] = await repository.matching(
      new Criteria({ filters: [new Filter("id", "eq", id)], limit: 1 })
    )

    if (!user) {
      return res.status(404).json({
        code: "NOT_FOUND",
        message: "User not found",
      })
    }

    return res.status(200).json(user.toPublic())
  }
