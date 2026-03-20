import type { LinkuAPI } from "@linku/api-contract"

import { faker } from "@faker-js/faker"
import request from "supertest"

import { LoginEndpoint } from "~/api/auth/endpoints/login/login-endpoint.ts"
import { updateUserEndpoint } from "~/api/users/endpoints/update-user/update-user-endpoint.ts"
import { createAuthContext } from "~tests/fixtures/auth-context.ts"
import { AppBuilder } from "~tests/helpers/app-builder.ts"
import { UserMother } from "~tests/helpers/users/user-mother.ts"

const app = new AppBuilder().withSession().build()
app.post("/auth/login", LoginEndpoint.buildDefault())
app.patch("/users", updateUserEndpoint)

const it = createAuthContext().withHttpClient(app)

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

  it("fails if user is not authenticated", async () => {
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
