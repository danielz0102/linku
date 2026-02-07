import type { Request, Response } from "express"
import type { RegistrationService } from "./registration-service.js"
import type { PublicUser } from "#users/types.d.js"
import type { ErrorBody } from "#types.d.js"

export class RegistrationHandler {
  constructor(private readonly service: RegistrationService) {}

  handle = async (
    req: Request<unknown, unknown, RegistrationBody>,
    res: Response<PublicUser | ErrorBody>
  ) => {
    const { data, error } = await this.service.register(req.body)

    if (error?.usernameExists) {
      return res.status(409).json({
        message: "User already exists",
        errors: [{ field: "username", details: "Username already exists" }],
      })
    }

    if (error?.emailExists) {
      return res.status(409).json({
        message: "User already exists",
        errors: [{ field: "email", details: "Email already exists" }],
      })
    }

    res.status(200).json(data)
  }
}

type RegistrationBody = {
  username: string
  email: string
  password: string
  firstName: string
  lastName: string
}
