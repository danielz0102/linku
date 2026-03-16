import type { ConflictCheckFields, UniqueField, UserRepository } from "~/core/users/user-repository.ts"
import type { User } from "~/core/users/user.ts"

import { Email } from "~/core/users/email.ts"
import { UUID } from "~/core/uuid.ts"

export class InMemoryUserRepository implements UserRepository {
  private users: User[] = []

  async save(user: User): Promise<void> {
    const index = this.users.findIndex((u) => u.id === user.id)

    if (index === -1) {
      this.users.push(user)
      return
    }

    this.users[index] = user
  }

  async findConflict({ excludedId, username, email }: ConflictCheckFields) {
    const conflicts = this.users.filter((user) => {
      if (excludedId && user.id === excludedId.value) {
        return false
      }

      return user.username === username || user.email === email.value
    })

    if (conflicts.length === 0) return undefined

    return {
      usernameExists: conflicts.some((u) => u.username === username),
      emailExists: conflicts.some((u) => u.email === email.value),
    }
  }

  async findOne(field: UniqueField) {
    if (typeof field === "string") {
      return this.users.find((user) => user.username === field)
    }

    if (field instanceof UUID) {
      return this.users.find((user) => user.id === field.value)
    }

    if (field instanceof Email) {
      return this.users.find((user) => user.email === field.value)
    }

    return undefined
  }
}
