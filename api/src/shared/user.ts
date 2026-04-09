export type User = {
  id: string
  username: string
  hashedPassword: string
  firstName: string
  lastName: string
  bio: string | null
  profilePictureUrl: string | null
}

export type PublicUser = Omit<User, "hashedPassword">
