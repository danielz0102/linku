import { OAuth2Client } from "google-auth-library"
import { GOOGLE_OAUTH_CLIENT_ID } from "~/config/env.js"

const client = new OAuth2Client({ client_id: GOOGLE_OAUTH_CLIENT_ID })

export async function getUser(idToken: string) {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: GOOGLE_OAUTH_CLIENT_ID,
  })

  const payload = ticket.getPayload()

  if (!payload) {
    throw new Error("Invalid ID token")
  }

  const { email, given_name, family_name, picture, sub } = payload

  if (!email || !given_name || !family_name || !picture) {
    throw new Error("Required fields missing in token payload", {
      cause: { payload },
    })
  }

  return { sub, email, given_name, family_name, picture }
}
