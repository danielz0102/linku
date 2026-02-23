import type {
  PublicUser,
  RegistrationBody,
  RegistrationErrorBody,
} from "@linku/api-contract"
import type { RequestHandler } from "express"
import type { RegistrationService } from "./registration-service.js"

type RegistrationHandler = (
  service: RegistrationService
) => RequestHandler<never, PublicUser | RegistrationErrorBody, RegistrationBody>

export const registrationHandler: RegistrationHandler =
  (service) => async (req, res) => {
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
