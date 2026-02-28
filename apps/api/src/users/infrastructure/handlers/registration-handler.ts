import type { LinkuAPI } from "@linku/api-contract"
import type { RequestHandler } from "express"
import type { RegistrationUseCase } from "../../application/use-cases/registration-use-case.js"

type RegistrationHandler = (
  service: RegistrationUseCase
) => RequestHandler<
  never,
  LinkuAPI.RegisterUser["ResponseBody"],
  LinkuAPI.RegisterUser["RequestBody"]
>

export const registrationHandler: RegistrationHandler =
  (service) => async (req, res) => {
    const { ok, data, error } = await service.register(req.body)

    if (!ok) {
      return res.status(409).json({
        code: "VALIDATION_ERROR",
        message: "User already exists",
        errors: error,
      })
    }

    req.session.userId = data.id
    return res.status(200).json(data)
  }
