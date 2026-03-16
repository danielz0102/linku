import type { Express } from "express"

import { faker } from "@faker-js/faker"
import { hash } from "bcryptjs"
import request from "supertest"
import { test as base } from "vitest"

import type { TestUserDB } from "~tests/helpers/db/test-user-db.ts"

import { toPublicUser } from "~/core/use-cases/dtos/public-user.ts"
import { UserMother } from "~tests/helpers/users/user-mother.ts"

export function createAuthContext(db: TestUserDB) {
  const test = base.extend("registeredUser", async ({}, { onCleanup }) => {
    const password = faker.internet.password()
    const hashedPassword = await hash(password, 1)
    const user = UserMother.create({ hashedPassword })

    await db.insert(user)

    onCleanup(async () => {
      await db.reset()
    })

    return { publicData: toPublicUser(user), credentials: { username: user.username, password } }
  })

  return Object.assign(test, {
    withHttpClient(app: Express, loginEndpoint = "/auth/login") {
      return test.extend("http", async ({ registeredUser }) => {
        const http = request.agent(app)
        await http.post(loginEndpoint).send(registeredUser.credentials)
        return http
      })
    },
  })
}
