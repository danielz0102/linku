import type { Express } from "express"

import { faker } from "@faker-js/faker"
import { hash } from "bcryptjs"
import request from "supertest"

import { toPublicUser } from "~/core/use-cases/dtos/public-user.ts"
import { UserMother } from "~tests/helpers/users/user-mother.ts"

import { it as base } from "./db-context.ts"

export function createAuthContext() {
  const test = base.extend("registeredUser", async ({ db }, { onCleanup }) => {
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
