import { User } from "#users/domain/user.js"

export interface UserRepository {
  create(newUser: NewUser): Promise<User>
  findOne(filters: UserFilters): Promise<User | undefined>
  search(filters: UserFilters, options?: SearchOptions): Promise<User[]>
  update(id: string, data: UpdateData): Promise<User>
  save(user: User): Promise<void>
}

export type NewUser = {
  username: string
  email: string
  hashedPassword: string
  firstName: string
  lastName: string
  profilePicUrl?: string
  bio?: string
}

export type UpdateData = Partial<{
  username: string
  email: string
  firstName: string
  lastName: string
  bio: string
  profilePicUrl: string
}>

export type UserFilters = Partial<{
  [K in keyof {
    id: string
    username: string
    email: string
    firstName: string
    lastName: string
  }]: User[K]
}>

export type SearchOptions = {
  limit?: number
  offset?: number
}
