import request from "supertest"

import { BcryptHasher } from "~/api/auth/adapters/bcrypt-hasher.ts"
import { LoginEndpoint } from "~/api/auth/endpoints/login/login-endpoint.ts"
import { Login } from "~/core/use-cases/login-use-case.ts"
import { DrizzleUserRepository } from "~/shared/adapters/drizzle-user-repository.ts"
import { createAuthContext } from "~tests/fixtures/auth-context.ts"
import { AppBuilder } from "~tests/helpers/app-builder.ts"

const it = createAuthContext()

describe("POST /auth/login", () => {
  const app = new AppBuilder().withSession().build()

  it.beforeAll(({ dbClient }) => {
    const repo = new DrizzleUserRepository(dbClient)
    const hasher = new BcryptHasher(1)
    const useCase = new Login({ userRepo: repo, hasher })
    app.post("/auth/login", new LoginEndpoint(useCase).build(false))
  })

  it("sends a 200 response with user data and session cookie", async ({ registeredUser }) => {
    const { credentials, publicData } = registeredUser

    await request(app)
      .post("/auth/login")
      .send(credentials)
      .expect(200)
      .expect("Set-Cookie", /.+/)
      .expect(publicData)
  })

  it("sends a 401 response if credentials are invalid", async () => {
    await request(app)
      .post("/auth/login")
      .send({ username: "invalid", password: "invalid" })
      .expect(401)
  })
})
