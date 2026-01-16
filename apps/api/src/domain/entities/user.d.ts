type Status = "online" | "offline"

type User = {
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

type LoginCredentials = {
  username: string
  password: string
}

type LoginPayload = {
  user: PublicUser
  accessToken: string
  refreshToken: string
}

type RegisterCredentials = {
  username: string
  email: string
  password: string
  firstName: string
  lastName: string
  // TODO: handle picture upload
  // profilePicUrl?: string
}

type PublicUser = {
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
