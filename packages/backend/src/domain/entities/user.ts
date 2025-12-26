import { createCustomError } from "../utils/create-custom-error.js"
import { Email } from "../value-objects/email.js"

type UserParams = {
  id: string
  username: string
  email: string | Email
  passwordHash: string
  profilePicUrl?: string
  status?: "online" | "offline"
}

export default class User {
  public readonly id: string
  public username: string
  public email: Email
  public passwordHash: string
  public profilePicUrl?: string
  public status: "online" | "offline"

  constructor(params: UserParams) {
    this.validate(params)
    const email =
      params.email instanceof Email ? params.email : new Email(params.email)

    this.id = params.id
    this.username = params.username
    this.email = email
    this.passwordHash = params.passwordHash
    this.profilePicUrl = params.profilePicUrl
    this.status = params.status || "offline"
  }

  private validate(user: UserParams) {
    const { profilePicUrl } = user

    if (profilePicUrl) {
      try {
        new URL(profilePicUrl)
      } catch {
        throw new InvalidUserError("Invalid profile picture URL", {
          cause: { profilePicUrl },
        })
      }
    }
  }
}

export const InvalidUserError = createCustomError("InvalidUserError")
