import type { User } from "~/core/users/user.ts"

export interface TestUserDB {
  insert(user: User): Promise<void>
  deleteById(id: string): Promise<void>
  findByUsername(username: string): Promise<User | undefined>
  reset(): Promise<void>
  seed(count: number, prefixes?: Prefixes): Promise<User[]>
}

export type Prefixes = Partial<{
  username: string
  firstName: string
  lastName: string
}>
