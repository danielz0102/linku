import { createFakeRegisterCredentials } from "#__tests__/lib/create-fake-register-credentials.js"
import { createFileServiceMock } from "#__tests__/lib/file-service-mock.js"
import { createTestAuthRouter } from "#__tests__/lib/create-test-auth-router.js"
import * as deps from "#infrastructure/dependencies.js"
import request from "supertest"
import { createTestApp } from "./lib/create-test-app.js"
import { toPublicUser } from "#domain/entities/user-mapper.js"

const fileServiceMock = createFileServiceMock()
const authRouter = createTestAuthRouter({ fileService: fileServiceMock })
const app = createTestApp(authRouter)
const fakeCredentials = createFakeRegisterCredentials()

afterEach(async () => {
  await deps.userRepo.deleteBy({ email: fakeCredentials.email })
})

describe("POST /register", () => {
  it("sends user public data with access token", async () => {
    const response = await request(app)
      .post("/register")
      .send(fakeCredentials)
      .expect(201)

    const user = await deps.userRepo.findBy({ email: fakeCredentials.email })

    if (!user) {
      throw new Error("User was not created in the repository")
    }

    expect(response.body).toMatchObject({
      user: toPublicUser(user),
      accessToken: expect.any(String),
    })
  })

  it("sends 409 when the user already exists", async () => {
    await deps.userRepo.create(fakeCredentials)
    await request(app).post("/register").send(fakeCredentials).expect(409)
  })

  it("sends 400 when the input data is invalid", async () => {
    await request(app).post("/register").send({}).expect(400)
    await request(app)
      .post("/register")
      .send({ ...fakeCredentials, email: "invalid-email" })
      .expect(400)
  })

  it("sends 400 when password is weak", async () => {
    await request(app)
      .post("/register")
      .send({ ...fakeCredentials, password: "123" })
      .expect(400)
  })

  it("sends 400 when image type is not allowed", async () => {
    const response = await request(app)
      .post("/register")
      .field("username", fakeCredentials.username)
      .field("email", fakeCredentials.email)
      .field("password", fakeCredentials.password)
      .attach("picture", Buffer.from("fake-content"), {
        filename: "test.svg",
        contentType: "image/svg+xml",
      })
      .expect(400)

    expect(response.body).toMatchObject({
      error: expect.stringContaining("image type"),
    })
  })
})
