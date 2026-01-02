import type { Request, Response } from "express"
import { getUserId } from "~/services/auth-google-service.js"

interface AuthRequest extends Request {
  token: string
}

export class AuthController {
  auth = async (req: Request, res: Response) => {
    if (!this.isAuthReq(req)) {
      throw new Error("Invalid authentication request")
    }

    try {
      const userId = await getUserId(req.token)

      /*
      If the user is already registered, generate a session,
      else, create a new user record in the database

      send back user info and session token
      */

      return res.status(200).json({ userId })
    } catch {
      return res.sendStatus(401)
    }
  }

  private isAuthReq(req: Request): req is AuthRequest {
    return (req as AuthRequest).token !== undefined
  }
}
