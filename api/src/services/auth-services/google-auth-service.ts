import type { User } from "~/db/drizzle/schema.js"
import type { AuthService } from "./auth-service.js"

import { OAuth2Client, type TokenPayload } from "google-auth-library"
import { GOOGLE_OAUTH_CLIENT_ID } from "~/config/env.js"
import { Result } from "~/lib/Result.js"

interface UserPayload {
  sub: string
  email: string
  given_name: string
  family_name: string
  picture: string
}

export class GoogleAuthService implements AuthService {
  private client: OAuth2Client

  constructor() {
    this.client = new OAuth2Client({ client_id: GOOGLE_OAUTH_CLIENT_ID })
  }

  async verifyToken(token: string): Promise<Result<User>> {
    let ticket

    try {
      ticket = await this.client.verifyIdToken({
        idToken: token,
        audience: GOOGLE_OAUTH_CLIENT_ID,
      })
    } catch (err) {
      return Result.fail(err as Error)
    }

    const payload = ticket.getPayload()

    if (!payload) {
      throw new Error("Token payload is empty")
    }

    const userPayload = this.validatePayload(payload)

    return Result.ok(this.payloadToUser(userPayload))
  }

  private validatePayload(payload: TokenPayload): UserPayload {
    const { email, given_name, family_name, picture, sub } = payload

    if (!email || !given_name || !family_name || !picture) {
      throw new Error("Required fields missing in token payload", {
        cause: { payload },
      })
    }

    return { sub, email, given_name, family_name, picture }
  }

  private payloadToUser(payload: UserPayload): User {
    return {
      id: payload.sub,
      email: payload.email,
      firstName: payload.given_name,
      lastName: payload.family_name,
      picture: payload.picture,
    }
  }
}
