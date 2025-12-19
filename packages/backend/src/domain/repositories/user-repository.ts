import type User from "../entities/user.js"
import { createCustomError } from "../utils/create-custom-error.js"

export type NewUser = {
  username: string
  email: string
  passwordHash: string
  profilePicUrl?: string
  status?: "online" | "offline"
}

export interface UserRepository {
  register(user: NewUser): Promise<User>
  exists(email: string, username: string): Promise<boolean>
}

export const UserRepositoryError = createCustomError("UserRepositoryError")
