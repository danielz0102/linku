import { faker } from "@faker-js/faker"
import { hash } from "bcryptjs"
import { test as base } from "vitest"

import type { TestUserDB } from "~tests/helpers/db/test-user-db.ts"

import { toPublicUser } from "~/core/use-cases/dtos/public-user.ts"
import { DrizzleTestUserDB } from "~tests/helpers/db/drizzle-test-user-db.ts"
import { UserMother } from "~tests/helpers/users/user-mother.ts"

export function createAuthContext(db: TestUserDB = new DrizzleTestUserDB()) {
  return base.extend("registeredUser", async ({}, { onCleanup }) => {
    const password = faker.internet.password()
    const hashedPassword = await hash(password, 1)
    const user = UserMother.create({ hashedPassword })

    await db.insert(user)

    onCleanup(async () => {
      await db.reset()
    })

    return { publicData: toPublicUser(user), credentials: { username: user.username, password } }
  })
}
