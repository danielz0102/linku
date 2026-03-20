import { faker } from "@faker-js/faker"
import { hash } from "bcryptjs"

import { toPublicUser } from "~/core/use-cases/dtos/public-user.ts"
import { UserMother } from "~tests/helpers/users/user-mother.ts"

import { it as base } from "./db-context.ts"

export const it = base.extend("registeredUser", async ({ db }) => {
  const password = faker.internet.password()
  const hashedPassword = await hash(password, 1)
  const user = UserMother.create({ hashedPassword })

  await db.insert(user)
  return { publicData: toPublicUser(user), credentials: { username: user.username, password } }
})
