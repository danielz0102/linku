import type { PublicUser } from "#users/types.d.js"
import type { Request, Response } from "express"
import type { RegistrationService } from "./registration-service.js"
import type { RegistrationBody, RegistrationErrorBody } from "./types.js"

export class RegistrationHandler {
  constructor(private readonly service: RegistrationService) {}

  handle = async (
    req: Request<unknown, unknown, RegistrationBody>,
    res: Response<PublicUser | RegistrationErrorBody>
  ) => {
    const { data, error } = await this.service.register(req.body)

    if (error?.usernameExists) {
      return res.status(409).json({
        code: "VALIDATION_ERROR",
        message: "User already exists",
        errors: {
          username: "Username already exists",
        },
      })
    }

    if (error?.emailExists) {
      return res.status(409).json({
        code: "VALIDATION_ERROR",
        message: "User already exists",
        errors: {
          email: "Email already exists",
        },
      })
    }

    res.status(200).json(data)
  }
}
