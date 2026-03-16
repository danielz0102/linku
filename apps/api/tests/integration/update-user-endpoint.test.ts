import type { LinkuAPI } from "@linku/api-contract"

import { faker } from "@faker-js/faker"
import request from "supertest"

import { loginEndpoint } from "~/api/auth/endpoints/login/login-endpoint.ts"
import { updateUserEndpoint } from "~/api/users/endpoints/update-user/update-user-endpoint.ts"
import { createAuthContext } from "~tests/fixtures/auth-context.ts"
import { AppBuilder } from "~tests/helpers/app-builder.ts"
import { DrizzleTestUserDB } from "~tests/helpers/db/drizzle-test-user-db.ts"
import { UserMother } from "~tests/helpers/users/user-mother.ts"

const it = createAuthContext()
const db = new DrizzleTestUserDB()

describe("PATCH /users", () => {
  const app = new AppBuilder().withSession().build()
  app.post("/auth/login", loginEndpoint)
  app.patch("/users", updateUserEndpoint)

  afterAll(async () => {
    await db.reset()
  })

  it("sends user public data", async ({ registeredUser }) => {
    const http = request.agent(app)
    await http.post("/auth/login").send(registeredUser.credentials).expect(200)
    const payload: LinkuAPI.UpdateUser["RequestBody"] = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      bio: faker.lorem.sentence(),
      profilePicUrl: faker.internet.url({ appendSlash: true }),
    }

    const { body } = await http.patch("/users").send(payload).expect(200)

    expect(body).toMatchObject({
      ...registeredUser.publicData,
      ...payload,
    })
  })

  it("fails if user is not authenticated", async () => {
    await request(app).patch("/users").send({ firstName: "Unauthenticated" }).expect(401)
  })

  it("fails if user data has conflicts", async ({ registeredUser }) => {
    const existing = UserMother.create()
    await db.insert(existing)

    const http = request.agent(app)
    await http.post("/auth/login").send(registeredUser.credentials).expect(200)

    await http.patch("/users").send({ username: existing.username }).expect(409)
  })

  it("fails if not data is provided", async ({ registeredUser }) => {
    const http = request.agent(app)
    await http.post("/auth/login").send(registeredUser.credentials).expect(200)

    await http.patch("/users").send({}).expect(400)
  })

  it("fails if picture URL is not valid", async ({ registeredUser }) => {
    const http = request.agent(app)
    await http.post("/auth/login").send(registeredUser.credentials).expect(200)

    await http.patch("/users").send({ profilePicUrl: "not-a-url" }).expect(400)
  })
})
