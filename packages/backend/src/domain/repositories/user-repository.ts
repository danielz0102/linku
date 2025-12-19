import User from "../entities/user.js"

export type NewUser = {
  username: string
  email: string
  passwordHash: string
  profilePicUrl?: string
  status?: "online" | "offline"
}

export interface UserRepository {
  register(user: NewUser): Promise<User>
}
