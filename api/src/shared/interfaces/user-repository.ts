import type { User } from "../user.ts"

export interface UserRepository {
  findByUsername(username: string): Promise<User | null>
  create(user: CreateUserParams): Promise<User>
}

export type CreateUserParams = {
  username: string
  hashedPassword: string
  firstName: string
  lastName: string
  bio?: string
  profilePictureUrl?: string
}
