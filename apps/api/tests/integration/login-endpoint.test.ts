import request from "supertest"

import { createLoginEndpoint } from "~/api/auth/endpoints/login/login-endpoint.ts"
import { BcryptHasher } from "~/api/auth/adapters/bcrypt-hasher.ts"
import { Login } from "~/core/use-cases/login-use-case.ts"
import { DrizzleUserRepository } from "~/shared/adapters/drizzle-user-repository.ts"
import { createAuthContext } from "~tests/fixtures/auth-context.ts"
import { AppBuilder } from "~tests/helpers/app-builder.ts"
import { DrizzleTestUserDB } from "~tests/helpers/db/drizzle-test-user-db.ts"

const app = new AppBuilder().withSession().build()
const db = new DrizzleTestUserDB()
const userRepo = new DrizzleUserRepository(db.db)
app.post(
  "/auth/login",
  createLoginEndpoint({
    login: new Login({
      userRepo,
      hasher: new BcryptHasher(1),
    }),
  })
)

const it = createAuthContext(db)

describe("POST /auth/login", () => {
  afterAll(async () => {
    await db.reset()
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
