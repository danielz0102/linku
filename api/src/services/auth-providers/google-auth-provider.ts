import { OAuth2Client } from "google-auth-library"
import {
  CLIENT_ORIGIN,
  GOOGLE_OAUTH_CLIENT_ID,
  GOOGLE_OAUTH_CLIENT_SECRET,
} from "~/config/env.js"
import { Result } from "~/lib/Result.js"
import type { AuthProvider, AuthProviderPayload } from "./auth-provider.js"

export class GoogleAuthProvider implements AuthProvider {
  private client: OAuth2Client

  constructor() {
    this.client = new OAuth2Client({
      clientId: GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: GOOGLE_OAUTH_CLIENT_SECRET,
      redirectUri: CLIENT_ORIGIN,
    })
  }

  async getUser(code: string): Promise<Result<AuthProviderPayload>> {
    const idToken = await this.getIdToken(code)

    if (!idToken) {
      return Result.fail(new Error("Code is not valid"))
    }

    const ticket = await this.client.verifyIdToken({ idToken })
    const payload = ticket.getPayload()

    if (!payload) {
      throw new Error("Token payload is empty")
    }

    const { email, given_name, family_name, picture, sub } = payload

    if (!email || !given_name || !family_name || !picture) {
      throw new Error("Required fields missing in token payload", {
        cause: { payload },
      })
    }

    return Result.ok({
      sub: sub,
      email: email,
      firstName: given_name,
      lastName: family_name,
      picture: picture,
      provider: "google",
    })
  }

  private async getIdToken(code: string): Promise<string | undefined> {
    try {
      const { tokens } = await this.client.getToken(code)
      return tokens.id_token || undefined
    } catch {
      return undefined
    }
  }
}
