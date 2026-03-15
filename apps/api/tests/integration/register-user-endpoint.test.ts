import { faker } from "@faker-js/faker"
import request from "supertest"

import { loginEndpoint } from "~/api/auth/endpoints/login/login-endpoint.ts"
import { registerUserEndpoint } from "~/api/auth/endpoints/register/register-user-endpoint.ts"
import { createAuthContext } from "~tests/fixtures/auth-context.ts"
import { AppBuilder } from "~tests/helpers/app-builder.ts"
import { DrizzleTestUserDAO } from "~tests/helpers/db/drizzle-test-user-dao.ts"

const it = createAuthContext()
const dao = new DrizzleTestUserDAO()

const createRegistration = () => ({
  email: faker.internet.email(),
  username: faker.internet.username(),
  password: "Password1!",
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
})

describe("POST /auth/register", () => {
  const app = new AppBuilder().withSession().build()
  app.post("/auth/register", registerUserEndpoint)
  app.post("/auth/login", loginEndpoint)

  describe("successful registration", () => {
    let registrationData: ReturnType<typeof createRegistration>

    beforeEach(() => {
      registrationData = createRegistration()
    })

    afterEach(async () => {
      const user = await dao.findByUsername(registrationData.username)
      if (user) await dao.deleteById(user.id)
    })

    it("sends a 200 response with public user data", async () => {
      const { body } = await request(app).post("/auth/register").send(registrationData).expect(200)
      const { password: _, ...publicData } = registrationData

      expect(body).toMatchObject(publicData)
      expect(body).not.toHaveProperty("hashedPassword")
    })

    it("sets a session cookie", async () => {
      await request(app)
        .post("/auth/register")
        .send(createRegistration())
        .expect(200)
        .expect("Set-Cookie", /.+/)
    })

    it("allows the user to login after registration", async () => {
      await request(app).post("/auth/register").send(registrationData).expect(200)
      const { username, password } = registrationData

      await request(app).post("/auth/login").send({ username, password }).expect(200)
    })

    it("hashes the password", async () => {
      await request(app).post("/auth/register").send(registrationData).expect(200)
      const user = await dao.findByUsername(registrationData.username)

      expect(user?.hashedPassword).not.toBe(registrationData.password)
    })
  })

  describe("errors", () => {
    it("sends a 409 response if user already exists", async ({
      registeredUser: {
        credentials: { username },
      },
    }) => {
      const registration = { ...createRegistration(), username }
      await request(app).post("/auth/register").send(registration).expect(409)
    })
  })

  describe("password validation", () => {
    it.each([
      { password: "Ab1!", description: "too short (< 8 characters)" },
      { password: "abcdefg1!", description: "missing uppercase letter" },
      { password: "ABCDEFG1!", description: "missing lowercase letter" },
      { password: "Abcdefg!", description: "missing number" },
      { password: "Abcdefg1", description: "missing special character" },
    ])("sends a 400 response if password is $description", async ({ password }) => {
      const registration = { ...createRegistration(), password }
      await request(app).post("/auth/register").send(registration).expect(400)
    })
  })
})
