import type { UniqueField, UniqueFields, UserRepository } from "~/core/users/user-repository.ts"
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

  async findExisting(fields: Partial<UniqueFields>) {
    return this.users.find((user) => {
      if (fields.id && user.id === fields.id.value) {
        return false
      }

      const hasUsernameConflict = fields.username ? user.username === fields.username : false
      const hasEmailConflict = fields.email ? user.email === fields.email.value : false

      return hasUsernameConflict || hasEmailConflict
    })
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
