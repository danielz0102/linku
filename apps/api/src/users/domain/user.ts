type UserParams = {
  id: string
  username: string
  email: string
  hashedPassword: string
  firstName: string
  lastName: string
  profilePicUrl?: string | null
  bio?: string | null
}

export type PublicUser = {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  profilePicUrl: string | null
  bio: string | null
}

export class User {
  public readonly id: string
  public readonly username: string
  public readonly email: string
  public readonly hashedPassword: string
  public readonly firstName: string
  public readonly lastName: string
  public readonly profilePicUrl: string | null
  public readonly bio: string | null

  constructor(params: UserParams) {
    this.id = params.id
    this.username = params.username
    this.email = params.email
    this.hashedPassword = params.hashedPassword
    this.firstName = params.firstName
    this.lastName = params.lastName
    this.profilePicUrl = params.profilePicUrl ?? null
    this.bio = params.bio ?? null
  }

  toPublic(): PublicUser {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      profilePicUrl: this.profilePicUrl,
      bio: this.bio,
    }
  }
}
