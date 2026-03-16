import type { UniqueFields, UserRepository } from "~/core/users/user-repository.ts"
import type { User } from "~/core/users/user.ts"

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

  async findOne(fields: Partial<UniqueFields>) {
    if (!fields.id && !fields.username && !fields.email) {
      return undefined
    }

    return this.users.find((user) => {
      if (fields.id && user.id !== fields.id.value) {
        return false
      }

      if (fields.username && user.username !== fields.username) {
        return false
      }

      if (fields.email && user.email !== fields.email.value) {
        return false
      }

      return true
    })
  }
}
