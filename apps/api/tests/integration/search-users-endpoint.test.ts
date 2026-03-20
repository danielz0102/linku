import { faker } from "@faker-js/faker"
import request from "supertest"

import { BcryptHasher } from "~/api/auth/adapters/bcrypt-hasher.ts"
import { LoginEndpoint } from "~/api/auth/endpoints/login/login-endpoint.ts"
import { Login } from "~/core/use-cases/login-use-case.ts"
import { SearchUsers } from "~/core/use-cases/search-users-use-case.ts"
import { DrizzleUserReadRepository } from "~/api/users/adapters/drizzle-user-read-repository.ts"
import { DrizzleUserRepository } from "~/shared/adapters/drizzle-user-repository.ts"
import { SearchUsersEndpoint } from "~/api/users/endpoints/search-users/search-users-endpoint.ts"
import { createAuthContext } from "~tests/fixtures/auth-context.ts"
import { createTestApp } from "~tests/helpers/app-builder.ts"

const it = createAuthContext()
  .extend("app", ({ dbClient }) => {
    const app = createTestApp()
    const login = new Login({
      userRepo: new DrizzleUserRepository(dbClient),
      hasher: new BcryptHasher(1),
    })
    const search = new SearchUsers(new DrizzleUserReadRepository(dbClient))
    app.post("/auth/login", new LoginEndpoint(login).build(false))
    app.get("/users", new SearchUsersEndpoint(search).build())
    return app
  })
  .extend("http", async ({ app, registeredUser }) => {
    const http = request.agent(app)
    await http.post("/auth/login").send(registeredUser.credentials)
    return http
  })

describe("GET /users", () => {
  it("sends a list of users", async ({ db, http }) => {
    const query = faker.string.alphanumeric(5)
    await db.seed(5, { username: query })

    const { body } = await http.get("/users").query({ q: query }).expect(200)

    expect(body).toHaveLength(5)
    expect(body[0]).not.toHaveProperty("hashedPassword")
  })

  it("sends an empty list if no users match the query", async ({ http }) => {
    const { body } = await http.get("/users").query({ q: "nonexistent" }).expect(200)
    expect(body).toHaveLength(0)
  })

  it("sends the number of users specified by the limit query parameter", async ({ db, http }) => {
    const query = faker.string.alphanumeric(5)
    await db.seed(10, { username: query })

    const { body } = await http.get("/users").query({ q: query, limit: 5 }).expect(200)

    expect(body).toHaveLength(5)
  })

  it("sends a page of 20 users by default", async ({ db, http }) => {
    const query = faker.string.alphanumeric(5)
    await db.seed(25, { firstName: query })

    const { body } = await http.get("/users").query({ q: query }).expect(200)

    expect(body).toHaveLength(20)
  })

  it("sends 401 if not authenticated", async ({ app }) => {
    await request(app).get("/users").query({ q: "any" }).expect(401)
  })

  it("sends 400 for invalid query parameters", async ({ http }) => {
    await http.get("/users").query({ q: "any", limit: -1 }).expect(400)
    await http.get("/users").query({ q: "any", limit: 20, offset: -1 }).expect(400)
    await http.get("/users").query({ q: "" }).expect(400)
  })
})
