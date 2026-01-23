import { createFakeRegisterCredentials } from "#__tests__/lib/create-fake-register-credentials.js"
import { userRepo } from "#infrastructure/dependencies.js"
import { composeAuthRouter } from "#presentation/composition.js"
import request from "supertest"
import { createTestApp } from "./lib/create-test-app.js"

const app = createTestApp(composeAuthRouter())
const fakeCredentials = createFakeRegisterCredentials({
  profilePicUrl: undefined,
})

afterEach(async () => {
  await userRepo.deleteBy({ email: fakeCredentials.email })
})

describe("POST /register", () => {
  it("sends user public data with access token", async () => {
    const response = await request(app)
      .post("/register")
      .send(fakeCredentials)
      .expect(201)

    expect(response.body).toMatchObject({
      accessToken: expect.any(String),
    })
  })

  it.todo("handles profile picture upload")
  it.todo("validates input data")
})
