import type { ErrorBody, LoginBody, PublicUser } from "@linku/api-contract"
import type { RequestHandler } from "express"
import type { LoginService } from "./login-service.js"

type LoginHandler = (
  service: LoginService
) => RequestHandler<never, PublicUser | ErrorBody, LoginBody>

export const loginHandler: LoginHandler = (service) => async (req, res) => {
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
