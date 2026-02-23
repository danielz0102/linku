import type {
  PublicUser,
  UpdateUserBody,
  UpdateUserErrorBody,
} from "@linku/api-contract"
import type { RequestHandler } from "express"
import type { UpdateUserService } from "./update-user-service.js"

type UpdateUserHandler = (
  service: UpdateUserService
) => RequestHandler<never, PublicUser | UpdateUserErrorBody, UpdateUserBody>

export const updateUserHandler: UpdateUserHandler =
  (service) => async (req, res) => {
    const userId = req.session.userId

    if (!userId) {
      throw new Error("User ID not found in session")
    }

    const { ok, data, error } = await service.update(userId, req.body)

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

    return res.status(200).json(data)
  }
