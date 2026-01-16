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
