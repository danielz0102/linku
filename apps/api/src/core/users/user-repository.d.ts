import type { UUID } from "#shared/domain/uuid.js"

import type { Email } from "./email.ts"
import type { User } from "./user.ts"

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
