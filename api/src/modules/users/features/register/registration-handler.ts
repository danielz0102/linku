import type {
  PublicUser,
  RegistrationBody,
  RegistrationErrorBody,
} from "api-contract"
import type { Request, Response } from "express"
import type { RegistrationService } from "./registration-service.js"

export const registrationHandler = (service: RegistrationService) => {
  return async (
    req: Request<unknown, unknown, RegistrationBody>,
    res: Response<PublicUser | RegistrationErrorBody>
  ) => {
    const { ok, data, error } = await service.register(req.body)

    if (ok) {
      const userId = data.id
      req.session.userId = userId
      return res.status(200).json(data)
    }

    if (error.usernameExists) {
      return res.status(409).json({
        code: "VALIDATION_ERROR",
        message: "User already exists",
        errors: {
          username: "Username already exists",
        },
      })
    }

    return res.status(409).json({
      code: "VALIDATION_ERROR",
      message: "User already exists",
      errors: {
        email: "Email already exists",
      },
    })
  }
}
