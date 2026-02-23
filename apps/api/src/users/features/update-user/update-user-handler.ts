import type {
  PublicUser,
  UpdateUserBody,
  UpdateUserErrorBody,
} from "@linku/api-contract"
import type { Request, Response } from "express"
import type { UpdateUserService } from "./update-user-service.js"

export const updateUserHandler = (service: UpdateUserService) => {
  return async (
    req: Request<unknown, unknown, UpdateUserBody>,
    res: Response<PublicUser | UpdateUserErrorBody>
  ) => {
    const userId = req.session.userId!

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
}
