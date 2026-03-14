import type { LinkuAPI } from "@linku/api-contract"
import type { RequestHandler } from "express"

import type { UpdateUserError, UpdateUserUseCase } from "#core/use-cases/update-user-use-case.js"

type UpdateUserHandler = (
  useCase: UpdateUserUseCase
) => RequestHandler<never, LinkuAPI.UpdateUser["ResponseBody"], LinkuAPI.UpdateUser["RequestBody"]>

export const updateUserHandler: UpdateUserHandler = (useCase) => async (req, res) => {
  const userId = req.session.userId

  if (!userId) {
    throw new Error("User ID not found in session")
  }

  const { ok, data, error } = await useCase.execute(userId, req.body)

  if (!ok) {
    return res.status(409).json({
      code: "VALIDATION_ERROR",
      message: "User already exists",
      errors: mapUpdateUserError(error),
    })
  }

  return res.status(200).json(data)
}

function mapUpdateUserError(error: UpdateUserError) {
  const result: Record<string, string> = {}

  if (error.username) {
    result["username"] = "Username already exists"
  }

  if (error.email) {
    result["email"] = "Email already exists"
  }

  return result
}
