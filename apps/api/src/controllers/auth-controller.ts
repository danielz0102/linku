import type { LoginWithCredentials } from "#use-cases/login-with-credentials.js"
import type { RegisterWithCredentials } from "#use-cases/register-with-credentials.js"
import type { Request, Response } from "express"

import { COOKIE_HTTPS_ONLY } from "#config/env.js"
import { RefreshTokenCookie } from "#domain/constants/cookies.js"
import { validateLoginCredentials } from "#validators/login-credentials-validator.js"
import { validateRegisterCredentials } from "#validators/register-credentials-validator.js"

type UseCases = {
  loginWithCredentials: LoginWithCredentials
  registerWithCredentials: RegisterWithCredentials
}

export class AuthController {
  private readonly loginWithCredentials: LoginWithCredentials
  private readonly registerWithCredentials: RegisterWithCredentials

  constructor({ loginWithCredentials, registerWithCredentials }: UseCases) {
    this.loginWithCredentials = loginWithCredentials
    this.registerWithCredentials = registerWithCredentials
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
    this.setRefreshTokenCookie(res, refreshToken)

    res.json({ user, accessToken })
  }

  register = async (req: Request, res: Response) => {
    const validation = validateRegisterCredentials(req.body)

    if (validation.error) {
      return res.status(400).json({ error: validation.error })
    }

    const result = await this.registerWithCredentials.execute({
      ...validation.data,
      profilePicUrl: req.file?.path,
    })

    if (!result.success) {
      return res.status(400).json({ error: result.error.message })
    }

    const { user, accessToken, refreshToken } = result.data
    this.setRefreshTokenCookie(res, refreshToken)

    res.status(201).json({ user, accessToken })
  }

  private setRefreshTokenCookie(res: Response, token: string) {
    res.cookie(RefreshTokenCookie.name, token, {
      httpOnly: true,
      secure: COOKIE_HTTPS_ONLY,
      sameSite: "lax",
      maxAge: RefreshTokenCookie.age,
    })
  }
}
