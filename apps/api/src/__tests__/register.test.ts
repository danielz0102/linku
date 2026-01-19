import { createFakeRegisterCredentials } from "#__tests__/lib/create-fake-register-credentials.js"
import { userRepository } from "#infraestructure/dependencies.js"
import { composeAuthRouter } from "#presentation/composition.js"
import express from "express"
import request from "supertest"

const apiRouter = composeAuthRouter()
const app = express()
app.use(express.json())
app.use(apiRouter)

const fakeCredentials = createFakeRegisterCredentials({
  profilePicUrl: undefined,
})

beforeEach(async () => {
  await userRepository.deleteBy({ email: fakeCredentials.email })
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
