import request from "supertest"

import { LoginEndpoint } from "~/api/auth/endpoints/login/login-endpoint.ts"
import { Login } from "~/core/use-cases/login-use-case.ts"
import { BcryptHasher } from "~/shared/adapters/bcrypt-hasher.ts"
import { DrizzleUserRepository } from "~/shared/adapters/drizzle-user-repository.ts"
import { it as base } from "~tests/fixtures/auth-context.ts"
import { createTestApp } from "~tests/helpers/app-builder.ts"

const it = base.extend("app", ({ dbClient }) => {
  const app = createTestApp()
  const useCase = new Login({
    userRepo: new DrizzleUserRepository(dbClient),
    hasher: new BcryptHasher(1),
  })
  app.post("/auth/login", new LoginEndpoint(useCase).build(false))
  return app
})

describe("POST /auth/login", () => {
  it("sends a 200 response with user data and session cookie", async ({ app, registeredUser }) => {
    const { credentials, publicData } = registeredUser

    await request(app)
      .post("/auth/login")
      .send(credentials)
      .expect(200)
      .expect("Set-Cookie", /.+/)
      .expect(publicData)
  })

  it("sends a 401 response if credentials are invalid", async ({ app }) => {
    await request(app)
      .post("/auth/login")
      .send({ username: "invalid", password: "invalid" })
      .expect(401)
  })
})
