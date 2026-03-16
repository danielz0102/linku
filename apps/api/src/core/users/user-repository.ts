import type { UUID } from "../uuid.js"
import type { Email } from "./email.js"
import type { User } from "./user.js"

export interface UserRepository {
  save(user: User): Promise<void>
  findExisting(fields: Partial<UniqueFields>): Promise<User | undefined>
  findOne(fields: Partial<UniqueFields>): Promise<User | undefined>
}

export type UniqueFields = {
  id: UUID
  username: string
  email: Email
}
