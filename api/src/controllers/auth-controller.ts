import type { Request, Response } from "express"
import { NODE_ENV } from "~/config/env.js"
import { Authenticate } from "~/use-cases/authenticate.js"

interface AuthRequest extends Request {
  token: string
}

export class AuthController {
  private static COOKIE_MAX_AGE = 1000 * 60 * 60 * 24 * 30 // 30 days

  constructor(private useCase: Authenticate) {}

  auth = async (req: Request, res: Response) => {
    if (!this.isAuthReq(req)) {
      throw new Error("Invalid authentication request")
    }

    const result = await this.useCase.execute(req.token)

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

  private isAuthReq(req: Request): req is AuthRequest {
    return (req as AuthRequest).token !== undefined
  }
}
