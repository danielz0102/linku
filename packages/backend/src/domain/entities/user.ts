import { InvalidUserError } from "../errors.js"

type UserParams = {
  id: string
  username: string
  email: string
  passwordHash: string
  profilePicUrl?: string
  status?: "online" | "offline"
}

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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(user.email)) {
      throw new InvalidUserError("Invalid email format")
    }

    if (user.profilePicUrl) {
      try {
        new URL(user.profilePicUrl)
      } catch {
        throw new InvalidUserError("Invalid profile picture URL")
      }
    }
  }
}
