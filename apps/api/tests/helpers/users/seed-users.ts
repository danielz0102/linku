import type { UserParams, UserPrimitives } from "~/core/users/user.ts"
import type { TestUserDAO } from "~tests/helpers/db/test-user-dao.ts"

import { UserMother } from "~tests/helpers/users/user-mother.ts"

export async function seedUsers(
  dao: TestUserDAO<UserPrimitives>,
  amount: number,
  overrides?: (index: number) => Partial<UserParams>
): Promise<UserPrimitives[]> {
  const users = Array.from({ length: amount }, (_, index) =>
    UserMother.create(overrides?.(index)).toPrimitives()
  )

  await Promise.all(users.map((user) => dao.insert(user)))
  return users
}
