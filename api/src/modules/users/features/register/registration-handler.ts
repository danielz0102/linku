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

    if (!ok) {
      return res.status(409).json({
        code: "VALIDATION_ERROR",
        message: "User already exists",
        errors: {
          username:
            error === "USERNAME_EXISTS" ? "Username already exists" : undefined,
          email: error === "EMAIL_EXISTS" ? "Email already exists" : undefined,
        },
      })
    }

    req.session.userId = data.id
    return res.status(200).json(data)
  }
}
