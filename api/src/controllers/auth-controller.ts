import type { Request, Response } from "express"
import { NODE_ENV } from "~/config/env.js"
import type { AuthModel } from "~/models/auth-model.js"

export class AuthController {
  private static COOKIE_MAX_AGE = 1000 * 60 * 60 * 24 * 30 // 30 days

  constructor(private model: AuthModel) {}

  auth = async (req: Request, res: Response) => {
    if (!req.token) {
      throw new Error("Invalid authentication request")
    }

    const result = await this.model.auth(req.token)

    if (!result.success) {
      return res.status(401).json({ message: result.error.message })
    }

    const { accessToken, refreshToken } = result.data

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: "lax",
      maxAge: AuthController.COOKIE_MAX_AGE,
    })

    res.json({ accessToken })
  }

  getMe = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refresh_token as string | undefined

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" })
    }

    const accessToken = await this.model.generateAccessToken(refreshToken)

    res.json({ accessToken })
  }
}
