import { InvalidUserError } from "../errors.js"

type UserParams = {
  id: string
  username: string
  email: string
  passwordHash: string
  profilePicUrl: string
}

export default class User {
  public readonly id: string
  public username: string
  public email: string
  public passwordHash: string
  public profilePicUrl: string

  constructor(params: UserParams) {
    this.validate(params)

    this.id = params.id
    this.username = params.username
    this.email = params.email
    this.passwordHash = params.passwordHash
    this.profilePicUrl = params.profilePicUrl
  }

  private validate(user: UserParams) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(user.email)) {
      throw new InvalidUserError("Invalid email format")
    }

    try {
      new URL(user.profilePicUrl)
    } catch {
      throw new InvalidUserError("Invalid profile picture URL")
    }
  }
}
