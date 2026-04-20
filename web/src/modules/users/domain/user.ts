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

  get data(): Readonly<UserData> {
    return {
      id: this.id,
      username: this.username,
      firstName: this.firstName,
      lastName: this.lastName,
      profilePictureUrl: this.profilePictureUrl,
      bio: this.bio,
    }
  }
}
