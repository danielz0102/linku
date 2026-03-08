import { User } from "#users/domain/user.js"

export interface UserRepository {
  create: (newUser: NewUser) => Promise<User>
  findOne: (filters: UserFilters) => Promise<User | undefined>
  update: (id: string, data: UpdateData) => Promise<User>
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
  id: string
  email: string
  username: string
}>
