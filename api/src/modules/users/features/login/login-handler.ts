import type { LoginErrorBody, LoginQuery, PublicUser } from "api-contract"
import type { Request, Response } from "express"
import type { LoginService } from "./login-service.js"

export const loginHandler = (service: LoginService) => {
  return async (
    req: Request<unknown, unknown, unknown, LoginQuery>,
    res: Response<PublicUser | LoginErrorBody>
  ) => {
    const { ok, data } = await service.login(req.query)

    if (!ok) {
      return res.status(401).json({
        code: "VALIDATION_ERROR",
        message: "Invalid email or password",
      })
    }

    req.session.userId = data.id
    return res.status(200).json(data)
  }
}
