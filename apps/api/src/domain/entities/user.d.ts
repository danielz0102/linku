type Status = "online" | "offline"

export type User = {
  id: string
  username: string
  email: string
  hashedPassword?: string
  firstName: string
  lastName: string
  profilePicUrl?: string
  status: Status
  bio?: string
  signUpAt: Date
}

export type LoginCredentials = {
  username: string
  password: string
}

export type LoginPayload = {
  user: PublicUser
  accessToken: string
  refreshToken: string
}

export type RegisterCredentials = {
  username: string
  email: string
  password: string
  firstName: string
  lastName: string
  profilePicUrl?: string
}

export type PublicUser = {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  profilePicUrl: string | null
  status: Status
  bio: string | null
  signUpAt: string
}
