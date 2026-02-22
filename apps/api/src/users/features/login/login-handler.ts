import type { LoginBody, LoginErrorBody, PublicUser } from "@linku/api-contract"
import type { Request, Response } from "express"
import type { LoginService } from "./login-service.js"

export const loginHandler = (service: LoginService) => {
  return async (
    req: Request<unknown, unknown, LoginBody>,
    res: Response<PublicUser | LoginErrorBody>
  ) => {
    const { ok, data } = await service.login(req.body)

    if (!ok) {
      return res.status(401).json({
        code: "UNAUTHORIZED",
        message: "Invalid username or password",
      })
    }

    req.session.userId = data.id
    return res.status(200).json(data)
  }
}
