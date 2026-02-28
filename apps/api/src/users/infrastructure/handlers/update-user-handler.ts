import type { LinkuAPI } from "@linku/api-contract"
import type { RequestHandler } from "express"
import type { UpdateUserUseCase } from "../../application/use-cases/update-user-use-case.js"

type UpdateUserHandler = (
  service: UpdateUserUseCase
) => RequestHandler<
  never,
  LinkuAPI.UpdateUser["ResponseBody"],
  LinkuAPI.UpdateUser["RequestBody"]
>

export const updateUserHandler: UpdateUserHandler =
  (service) => async (req, res) => {
    const userId = req.session.userId

    if (!userId) {
      throw new Error("User ID not found in session")
    }

    const { ok, data, error } = await service.update(userId, req.body)

    if (!ok) {
      return res.status(409).json({
        code: "VALIDATION_ERROR",
        message: "User already exists",
        errors: error,
      })
    }

    return res.status(200).json(data)
  }
