import { faker } from "@faker-js/faker"
import { hash } from "bcryptjs"
import { test as base } from "vitest"

import type { UserPrimitives } from "~/core/users/user.ts"
import type { TestUserDAO } from "~tests/helpers/db/test-user-dao.ts"

import { toPublicUser } from "~/core/use-cases/dtos/public-user.ts"
import { DrizzleTestUserDAO } from "~tests/helpers/db/drizzle-test-user-dao.ts"
import { UserMother } from "~tests/helpers/users/user-mother.ts"

export function createAuthContext(dao: TestUserDAO<UserPrimitives> = new DrizzleTestUserDAO()) {
  return base.extend("registeredUser", async ({}, { onCleanup }) => {
    const password = faker.internet.password()
    const hashedPassword = await hash(password, 1)
    const user = UserMother.create({ hashedPassword })
    const plainUser = user.toPrimitives()

    await dao.insert(plainUser)

    onCleanup(async () => {
      await dao.deleteById(user.id)
    })

    return { publicData: toPublicUser(user), credentials: { username: user.username, password } }
  })
}
