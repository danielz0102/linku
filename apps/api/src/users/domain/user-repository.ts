import type { Criteria } from "#shared/domain/criteria.js"
import type { User } from "#users/domain/user.js"

export interface UserRepository {
  create: (newUser: NewUser) => Promise<User>
  matching: (criteria: Criteria) => Promise<User[]>
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
