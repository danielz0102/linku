import type { LinkuAPI } from "@linku/api-contract"
import type { RequestHandler } from "express"

import type { Login } from "#core/use-cases/login-use-case.js"

type LoginHandler = (
  login: Login
) => RequestHandler<never, LinkuAPI.Login["ResponseBody"], LinkuAPI.Login["RequestBody"]>

export const loginHandler: LoginHandler = (login) => async (req, res) => {
  const { ok, data } = await login.execute(req.body)

  if (!ok) {
    return res.status(401).json({
      code: "UNAUTHORIZED",
      message: "Invalid username or password",
    })
  }

  req.session.userId = data.id
  return res.status(200).json(data)
}
