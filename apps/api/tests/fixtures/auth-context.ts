import { faker } from "@faker-js/faker"
import { hash } from "bcryptjs"
import { test as base } from "vitest"

import type { TestUserDAO } from "~tests/helpers/db/test-user-dao.ts"

import { toPublicUser } from "~/core/use-cases/dtos/public-user.ts"
import { DrizzleTestUserDAO } from "~tests/helpers/db/drizzle-test-user-dao.ts"
import { UserMother } from "~tests/helpers/users/user-mother.ts"

export function createAuthContext(dao: TestUserDAO = new DrizzleTestUserDAO()) {
  return base.extend("registeredUser", async ({}, { onCleanup }) => {
    const password = faker.internet.password()
    const hashedPassword = await hash(password, 1)
    const user = UserMother.create({ hashedPassword })

    await dao.insert(user)

    onCleanup(async () => {
      await dao.reset()
    })

    return { publicData: toPublicUser(user), credentials: { username: user.username, password } }
  })
}
