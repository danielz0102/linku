import type { LinkuAPI } from "@linku/api-contract"
import type { RequestHandler } from "express"

import type {
  RegistrationError,
  RegistrationUseCase,
} from "#core/use-cases/registration-use-case.js"

type RegistrationHandler = (
  useCase: RegistrationUseCase
) => RequestHandler<
  never,
  LinkuAPI.RegisterUser["ResponseBody"],
  LinkuAPI.RegisterUser["RequestBody"]
>

export const registrationHandler: RegistrationHandler = (useCase) => async (req, res) => {
  const { ok, data, error } = await useCase.execute(req.body)

  if (!ok) {
    return res.status(409).json({
      code: "VALIDATION_ERROR",
      message: "User already exists",
      errors: mapRegistrationError(error),
    })
  }

  req.session.userId = data.id
  return res.status(200).json(data)
}

function mapRegistrationError(error: RegistrationError) {
  const errors: Record<string, string> = {}

  if (error.username) {
    errors["username"] = "Username is already taken"
  }

  if (error.email) {
    errors["email"] = "Email is already taken"
  }

  return errors
}
