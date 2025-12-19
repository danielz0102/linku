import { createCustomError } from "../utils/create-custom-error.js"

type UserParams = {
  id: string
  username: string
  email: string
  passwordHash: string
  profilePicUrl?: string
  status?: "online" | "offline"
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default class User {
  public readonly id: string
  public username: string
  public email: string
  public passwordHash: string
  public profilePicUrl?: string
  public status: "online" | "offline"

  constructor(params: UserParams) {
    this.validate(params)

    this.id = params.id
    this.username = params.username
    this.email = params.email
    this.passwordHash = params.passwordHash
    this.profilePicUrl = params.profilePicUrl
    this.status = params.status || "offline"
  }

  private validate(user: UserParams) {
    const { email, profilePicUrl } = user

    if (!EMAIL_PATTERN.test(email)) {
      throw new InvalidUserError("Invalid email format", {
        cause: { email },
      })
    }

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
