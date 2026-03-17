import type { LinkuAPI } from "@linku/api-contract"
import type { RequestHandler } from "express"

import type { RegistrationError, Register } from "#core/use-cases/register-use-case.js"

type RegisterHandler = (
  register: Register
) => RequestHandler<
  never,
  LinkuAPI.RegisterUser["ResponseBody"],
  LinkuAPI.RegisterUser["RequestBody"]
>

export const registerHandler: RegisterHandler = (register) => async (req, res) => {
  const { ok, data, error } = await register.execute(req.body)

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
