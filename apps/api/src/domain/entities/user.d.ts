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

type Status = "online" | "offline"

type PrivateUserFields = Pick<User, "hashedPassword">
type PublicUser = UndefinedToNull<Omit<User, keyof PrivateUserFields>>
