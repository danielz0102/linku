import type { Request, Response } from "express"
import { Authenticate } from "~/use-cases/authenticate.js"

interface AuthRequest extends Request {
  token: string
}

export class AuthController {
  constructor(private useCase: Authenticate) {}

  auth = async (req: Request, res: Response) => {
    if (!this.isAuthReq(req)) {
      throw new Error("Invalid authentication request")
    }

    const result = await this.useCase.execute(req.token)

    if (!result.success) {
      return res.status(401).json({ message: result.error.message })
    }

    res.json({ token: result.data })
  }

  private isAuthReq(req: Request): req is AuthRequest {
    return (req as AuthRequest).token !== undefined
  }
}
