import type { Request, Response } from "express"
import type { UserRepository } from "~/repositories/user-repository.js"
import { authenticate } from "~/use-cases/authenticate.js"

interface AuthRequest extends Request {
  token: string
}

export class AuthController {
  constructor(private repo: UserRepository) {}

  auth = async (req: Request, res: Response) => {
    if (!this.isAuthReq(req)) {
      throw new Error("Invalid authentication request")
    }

    const user = await authenticate({ idToken: req.token, repo: this.repo })

    res.json({ user })
  }

  private isAuthReq(req: Request): req is AuthRequest {
    return (req as AuthRequest).token !== undefined
  }
}
