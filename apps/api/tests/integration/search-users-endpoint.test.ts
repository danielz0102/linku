import request from "supertest"

import { loginEndpoint } from "~/api/auth/endpoints/login/login-endpoint.ts"
import { getUsersEndpoint } from "~/api/users/endpoints/search-users/search-users-endpoint.ts"
import { toPublicUser } from "~/core/use-cases/dtos/public-user.ts"
import { createAuthContext } from "~tests/fixtures/auth-context.ts"
import { AppBuilder } from "~tests/helpers/app-builder.ts"
import { DrizzleTestUserDAO } from "~tests/helpers/db/drizzle-test-user-dao.ts"
import { seedUsers } from "~tests/helpers/users/seed-users.ts"

const it = createAuthContext()
const dao = new DrizzleTestUserDAO()

describe("GET /users", () => {
  const app = new AppBuilder().withSession().build()
  app.post("/auth/login", loginEndpoint)
  app.get("/users", ...getUsersEndpoint)

  afterAll(async () => {
    await dao.reset()
  })

  it("sends a list of users", async ({ registeredUser }) => {
    const http = request.agent(app)
    const query = `pub${registeredUser.publicData.id.slice(0, 8)}`
    const seededUsers = await seedUsers(dao, 2, (index) => ({
      username: `${query}-${index}`,
      firstName: query,
      lastName: "Match",
    }))

    await http.post("/auth/login").send(registeredUser.credentials).expect(200)

    const { body } = await http.get("/users").query({ q: query }).expect(200)
    expect(body).toHaveLength(2)
    expect(body).toEqual(expect.arrayContaining(seededUsers.map((u) => toPublicUser(u))))
  })

  it("sends a page of 20 users by default", async ({ registeredUser }) => {
    const http = request.agent(app)
    const query = `pg${registeredUser.publicData.id.slice(0, 8)}`
    await seedUsers(dao, 25, (index) => ({
      username: `${query}-${index}`,
      firstName: query,
      lastName: "Match",
    }))

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
