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

    const user = await repository.findOne({ id })

    if (!user) {
      return res.status(404).json({
        code: "NOT_FOUND",
        message: "User not found",
      })
    }

    return res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      bio: user.bio,
      profilePicUrl: user.profilePicUrl,
    })
  }
