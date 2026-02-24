import type {
  ErrorBody,
  PublicUser,
  RegistrationBody,
} from "@linku/api-contract"
import type { RequestHandler } from "express"
import type { RegistrationService } from "./registration-service.js"

type RegistrationHandler = (
  service: RegistrationService
) => RequestHandler<never, PublicUser | ErrorBody, RegistrationBody>

export const registrationHandler: RegistrationHandler =
  (service) => async (req, res) => {
    const { ok, data, error } = await service.register(req.body)

    if (!ok) {
      let errors = {}

      if (error === "USERNAME_EXISTS") {
        errors = {
          ...errors,
          username: "Username already exists",
        }
      }

      if (error === "EMAIL_EXISTS") {
        errors = {
          ...errors,
          email: "Email already exists",
        }
      }

      return res.status(409).json({
        code: "VALIDATION_ERROR",
        message: "User already exists",
        errors,
      })
    }

    req.session.userId = data.id
    return res.status(200).json(data)
  }
