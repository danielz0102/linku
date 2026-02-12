import type {
  PublicUser,
  RegistrationBody,
  RegistrationErrorBody,
} from "api-contract"
import type { Request, Response } from "express"
import type { RegistrationService } from "./registration-service.js"

export class RegistrationHandler {
  constructor(private readonly service: RegistrationService) {}

  handle = async (
    req: Request<unknown, unknown, RegistrationBody>,
    res: Response<PublicUser | RegistrationErrorBody>
  ) => {
    const result = await this.service.register(req.body)

    if (result.ok) {
      req.session.userId = result.data.id

      return res.status(200).json(result.data)
    }

    if (result.error.usernameExists) {
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
