import type { UUID } from "#shared/domain/uuid.js"
import { User } from "#users/domain/user.js"
import type { Email } from "./email.js"

export interface UserRepository {
  save(user: User): Promise<void>
  checkUniqueness(fields: Partial<UniqueFields>): Promise<User | undefined>
  findExisting(fields: Partial<UniqueFields>): Promise<User | undefined>
}

export type UniqueFields = {
  id: UUID
  username: string
  email: Email
}
