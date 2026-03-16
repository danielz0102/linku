import type { UUID } from "../uuid.js"
import type { Email } from "./email.js"
import type { User } from "./user.js"

export type ConflictCheckFields = {
  excludedId?: UUID
  username: string
  email: Email
}

export type ConflictResult = {
  usernameExists: boolean
  emailExists: boolean
}

export interface UserRepository {
  save(user: User): Promise<void>
  findConflict(fields: ConflictCheckFields): Promise<ConflictResult | undefined>
  findOne(field: UniqueField): Promise<User | undefined>
}

export type UniqueField = UUID | string | Email
