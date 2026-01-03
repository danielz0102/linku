import type { Request, Response } from "express"
import type { UserRepository } from "~/repositories/user-repository.js"
import type { AuthService } from "~/services/auth-services/auth-service.js"
import { authenticate } from "~/use-cases/authenticate.js"

interface AuthRequest extends Request {
  token: string
}

export class AuthController {
  constructor(
    private readonly repo: UserRepository,
    private readonly authService: AuthService
  ) {}

  auth = async (req: Request, res: Response) => {
    if (!this.isAuthReq(req)) {
      throw new Error("Invalid authentication request")
    }

    const result = await authenticate({
      idToken: req.token,
      repo: this.repo,
      authService: this.authService,
    })

    if (!result.success) {
      return res.status(401).json({ message: result.error.message })
    }

    res.json(result.data)
  }

  private isAuthReq(req: Request): req is AuthRequest {
    return (req as AuthRequest).token !== undefined
  }
}
