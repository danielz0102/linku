import type { User } from "~/core/users/user.ts"

export interface TestUserDAO {
  insert(user: User): Promise<void>
  deleteById(id: string): Promise<void>
  findByUsername(username: string): Promise<User | undefined>
  reset(): Promise<void>
}
