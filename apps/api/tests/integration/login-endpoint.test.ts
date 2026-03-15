import request from "supertest"

import { loginEndpoint } from "~/api/auth/endpoints/login/login-endpoint.ts"
import { createAuthContext } from "~tests/fixtures/auth-context.ts"
import { AppBuilder } from "~tests/helpers/app-builder.ts"

const it = createAuthContext()

describe("POST /auth/login", () => {
  const app = new AppBuilder().withSession().build()
  app.post("/auth/login", loginEndpoint)

  it("sends a 200 response with user data and session cookie", async ({ registeredUser }) => {
    const { credentials, publicData } = registeredUser

    await request(app)
      .post("/auth/login")
      .send(credentials)
      .expect(200)
      .expect("Set-Cookie", /.+/)
      .expect(publicData)
  })

  it("sends a 401 response if username does not exist", async () => {
    await request(app)
      .post("/auth/login")
      .send({ username: "invalid", password: "invalid" })
      .expect(401)
  })

  it("sends a 401 response if password is incorrect", async ({ registeredUser }) => {
    const { credentials } = registeredUser

    await request(app)
      .post("/auth/login")
      .send({ ...credentials, password: "wrongpassword" })
      .expect(401)
  })
})
