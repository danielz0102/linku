import { faker } from "@faker-js/faker"
import request from "supertest"

import { LoginEndpoint } from "~/api/auth/endpoints/login/login-endpoint.ts"
import { getUsersEndpoint } from "~/api/users/endpoints/search-users/search-users-endpoint.ts"
import { createAuthContext } from "~tests/fixtures/auth-context.ts"
import { AppBuilder } from "~tests/helpers/app-builder.ts"

const app = new AppBuilder().withSession().build()
app.post("/auth/login", LoginEndpoint.buildDefault())
app.get("/users", ...getUsersEndpoint)

const it = createAuthContext().withHttpClient(app)

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

  it("sends 401 if not authenticated", async () => {
    await request(app).get("/users").query({ q: "any" }).expect(401)
  })

  it("sends 400 for invalid query parameters", async ({ http }) => {
    await http.get("/users").query({ q: "any", limit: -1 }).expect(400)
    await http.get("/users").query({ q: "any", limit: 20, offset: -1 }).expect(400)
    await http.get("/users").query({ q: "" }).expect(400)
  })
})
