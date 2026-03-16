import { faker } from "@faker-js/faker"
import request from "supertest"

import { loginEndpoint } from "~/api/auth/endpoints/login/login-endpoint.ts"
import { getUsersEndpoint } from "~/api/users/endpoints/search-users/search-users-endpoint.ts"
import { toPublicUser } from "~/core/use-cases/dtos/public-user.ts"
import { createAuthContext } from "~tests/fixtures/auth-context.ts"
import { AppBuilder } from "~tests/helpers/app-builder.ts"
import { DrizzleTestUserDB } from "~tests/helpers/db/drizzle-test-user-db.ts"

const it = createAuthContext()
const db = new DrizzleTestUserDB()

describe("GET /users", () => {
  const app = new AppBuilder().withSession().build()
  app.post("/auth/login", loginEndpoint)
  app.get("/users", ...getUsersEndpoint)

  afterAll(async () => {
    await db.reset()
  })

  it("sends a list of users", async ({ registeredUser }) => {
    const http = request.agent(app)
    const query = faker.string.alphanumeric(5)
    const users = await db.seed(5, { username: query })

    await http.post("/auth/login").send(registeredUser.credentials).expect(200)

    const { body } = await http.get("/users").query({ q: query }).expect(200)
    expect(body).toHaveLength(5)
    expect(body).toEqual(users.map((u) => toPublicUser(u)))
  })

  it("sends a page of 20 users by default", async ({ registeredUser }) => {
    const http = request.agent(app)
    const query = faker.string.alphanumeric(5)
    await db.seed(25, { firstName: query })

    await http.post("/auth/login").send(registeredUser.credentials).expect(200)

    const { body } = await http.get("/users").query({ q: query }).expect(200)
    expect(body).toHaveLength(20)
  })

  it("sends 401 if not authenticated", async () => {
    await request(app).get("/users").query({ q: "any" }).expect(401)
  })

  it("validates query parameters", async ({ registeredUser }) => {
    const http = request.agent(app)
    await http.post("/auth/login").send(registeredUser.credentials).expect(200)

    await http.get("/users").query({ q: "any", limit: -1 }).expect(400)
    await http.get("/users").query({ q: "any", limit: 20, offset: -1 }).expect(400)
    await http.get("/users").query({ q: "" }).expect(400)
  })
})
