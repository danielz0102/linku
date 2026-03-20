import type { LinkuAPI } from "@linku/api-contract"

import { faker } from "@faker-js/faker"
import request from "supertest"

import { BcryptHasher } from "~/api/auth/adapters/bcrypt-hasher.ts"
import { LoginEndpoint } from "~/api/auth/endpoints/login/login-endpoint.ts"
import { UpdateUserEndpoint } from "~/api/users/endpoints/update-user/update-user-endpoint.ts"
import { Login } from "~/core/use-cases/login-use-case.ts"
import { UpdateUser } from "~/core/use-cases/update-user-use-case.ts"
import { DrizzleUserRepository } from "~/shared/adapters/drizzle-user-repository.ts"
import { createAuthContext } from "~tests/fixtures/auth-context.ts"
import { createTestApp } from "~tests/helpers/app-builder.ts"
import { UserMother } from "~tests/helpers/users/user-mother.ts"

const it = createAuthContext()
  .extend("app", ({ dbClient }) => {
    const app = createTestApp()
    const login = new Login({
      userRepo: new DrizzleUserRepository(dbClient),
      hasher: new BcryptHasher(1),
    })
    const updateUser = new UpdateUser(new DrizzleUserRepository(dbClient))
    app.post("/auth/login", new LoginEndpoint(login).build(false))
    app.patch("/users", new UpdateUserEndpoint(updateUser).build())
    return app
  })
  .extend("http", async ({ app, registeredUser }) => {
    const http = request.agent(app)
    await http.post("/auth/login").send(registeredUser.credentials)
    return http
  })

describe("PATCH /users", () => {
  it("sends user public data", async ({ http }) => {
    const payload: LinkuAPI.UpdateUser["RequestBody"] = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      bio: faker.lorem.sentence(),
      profilePicUrl: faker.internet.url({ appendSlash: true }),
    }

    const { body } = await http.patch("/users").send(payload).expect(200)

    expect(body).toMatchObject(payload)
  })

  it("fails if user is not authenticated", async ({ app }) => {
    await request(app).patch("/users").send({ firstName: "Unauthenticated" }).expect(401)
  })

  it("fails if user data has conflicts", async ({ db, http }) => {
    const existing = UserMother.create()
    await db.insert(existing)
    await http.patch("/users").send({ username: existing.username }).expect(409)
  })

  it("fails if not data is provided", async ({ http }) => {
    await http.patch("/users").send({}).expect(400)
  })

  it("fails if picture URL is not valid", async ({ http }) => {
    await http.patch("/users").send({ profilePicUrl: "not-a-url" }).expect(400)
  })
})
