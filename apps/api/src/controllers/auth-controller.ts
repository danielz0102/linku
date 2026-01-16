import { COOKIE_HTTPS_ONLY } from "#config/env.js"
import { RefreshTokenCookie } from "#domain/constants/cookies.js"
import type { LoginWithCredentials } from "#use-cases/login-with-credentials.js"
import { validateLoginCredentials } from "#validators/login-credentials-validator.js"
import type { Request, Response } from "express"

type UseCases = {
  loginWithCredentials: LoginWithCredentials
}

export class AuthController {
  private readonly loginWithCredentials: LoginWithCredentials

  constructor({ loginWithCredentials }: UseCases) {
    this.loginWithCredentials = loginWithCredentials
  }

  login = async (req: Request, res: Response) => {
    const validation = validateLoginCredentials(req.body)

    if (validation.error) {
      return res.status(400).json({ error: validation.error })
    }

    const result = await this.loginWithCredentials.execute(validation.data)

    if (!result.success) {
      return res.status(401).json({ error: result.error.message })
    }

    const { user, accessToken, refreshToken } = result.data

    res.cookie(RefreshTokenCookie.name, refreshToken, {
      httpOnly: true,
      secure: COOKIE_HTTPS_ONLY,
      sameSite: "lax",
      maxAge: RefreshTokenCookie.age,
    })

    res.json({ user, accessToken })
  }

  register = async (req: Request, res: Response) => {
    res.send("Register endpoint")
  }
}
