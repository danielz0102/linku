import type { UserRepository } from "~/repositories/user-repository.js"
import { getUser } from "~/services/auth-google-service.js"

interface Params {
  idToken: string
  repo: UserRepository
}

export async function authenticate({ idToken, repo }: Params) {
  const payload = await getUser(idToken)

  const user = (async () => {
    const existingUser = await repo.findByEmail(payload.email)

    if (existingUser) {
      return existingUser
    }

    return repo.create({
      email: payload.email,
      firstName: payload.given_name,
      lastName: payload.family_name,
      picture: payload.picture,
    })
  })()

  // TODO: generate session token

  return user
}
