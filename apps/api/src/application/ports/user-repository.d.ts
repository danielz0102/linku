import type { User } from "#domain/entities/user.d.js"

type UserQueryableFields = Pick<User, "id" | "username" | "email">
type Filters = Partial<UserQueryableFields>

type NewUser = {
  username: string
  email: string
  lastName: string
  firstName: string
  hashedPassword?: string
  profilePicUrl?: string
  bio?: string
}

export interface UserRepository {
  findBy(filters: Filters): Promise<User | undefined>
  create(user: NewUser): Promise<User>
  deleteBy(filters: Filters): Promise<void>
}
