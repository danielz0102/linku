export type UserData = {
  id: string
  username: string
  firstName: string
  lastName: string
  profilePictureUrl: string | null
  bio: string | null
}

export class User {
  readonly id: string
  readonly username: string
  readonly firstName: string
  readonly lastName: string
  readonly profilePictureUrl: string | null
  readonly bio: string | null

  constructor(data: UserData) {
    this.id = data.id
    this.username = data.username
    this.firstName = data.firstName
    this.lastName = data.lastName
    this.profilePictureUrl = data.profilePictureUrl
    this.bio = data.bio
  }

  get fullname(): string {
    return `${this.firstName} ${this.lastName}`
  }

  get initials(): string {
    const firstInitial = this.firstName.charAt(0).toUpperCase()
    const lastInitial = this.lastName.charAt(0).toUpperCase()
    return `${firstInitial}${lastInitial}`
  }

  get displayUsername(): string {
    return `@${this.username}`
  }
}
