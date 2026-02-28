export type User = {
  id: string
  username: string
  email: string
  hashedPassword: string
  firstName: string
  lastName: string
  profilePicUrl: string | null
  bio: string | null
}

export type PublicUser = Omit<User, "hashedPassword">
