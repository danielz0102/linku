import { toPublicUser } from "#domain/entities/user-mapper.js"
import { hasher, tokenSvc, userRepo } from "#infrastructure/dependencies.js"
import request from "supertest"
import { createFakeUser } from "./lib/create-fake-user-record.js"
import { createTestApp } from "./lib/create-test-app.js"
import { createTestAuthRouter } from "./lib/create-test-auth-router.js"

const actualPassword = "plainPassword123!"
const hashedPassword = await hasher.hash(actualPassword)
const fakeUser = createFakeUser({ hashedPassword })
const app = createTestApp(createTestAuthRouter())

beforeAll(async () => {
  await userRepo.create(fakeUser)
})

afterAll(async () => {
  await userRepo.deleteBy({ id: fakeUser.id })
})

describe("POST /login", () => {
  it("sends public user data and access token when credentials are valid", async () => {
    const response = await request(app)
      .post("/login")
      .send({ username: fakeUser.username, password: actualPassword })
      .expect(200)

    expect(response.body).toMatchObject({
      user: toPublicUser(fakeUser),
      accessToken: expect.any(String),
    })
    expect(response.body).not.toHaveProperty("hashedPassword")
  })

  it("assigns user id to access token", async () => {
    const response = await request(app)
      .post("/login")
      .send({ username: fakeUser.username, password: actualPassword })
      .expect(200)

    const decodedToken = await tokenSvc.verifyToken(response.body.accessToken)
    expect(decodedToken).toMatchObject({ userId: fakeUser.id })
  })

  it("sends 401 when password is invalid", async () => {
    await request(app)
      .post("/login")
      .send({ username: fakeUser.username, password: "wrongPassword123!!" })
      .expect(401)
  })

  it("sends 400 when credentials are missing", async () => {
    await request(app).post("/login").expect(400)
  })

  it("sends 400 when fields have invalid types", async () => {
    await request(app)
      .post("/login")
      .send({ username: 12345, password: true })
      .expect(400)
  })

  it("sends 400 when fields are empty strings", async () => {
    await request(app)
      .post("/login")
      .send({ username: "", password: "" })
      .expect(400)
  })
})
