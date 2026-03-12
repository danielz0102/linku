import { User } from "#users/domain/user.js"
import type { Criteria } from "#shared/domain/criteria.js"

export interface UserRepository {
  create(newUser: NewUser): Promise<User>
  matching(criteria: Criteria<UserFilters>): Promise<User[]>
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
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
}>
