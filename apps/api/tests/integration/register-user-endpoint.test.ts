import { faker } from "@faker-js/faker"
import request from "supertest"

import { loginEndpoint } from "~/api/auth/endpoints/login/login-endpoint.ts"
import { registerUserEndpoint } from "~/api/auth/endpoints/register/register-user-endpoint.ts"
import { createAuthContext } from "~tests/fixtures/auth-context.ts"
import { AppBuilder } from "~tests/helpers/app-builder.ts"
import { DrizzleTestUserDAO } from "~tests/helpers/db/drizzle-test-user-dao.ts"

const it = createAuthContext()

const dao = new DrizzleTestUserDAO()

function createRegistration() {
  return {
    email: faker.internet.email(),
    username: faker.internet.username(),
    password: "Password1!",
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
  }
}

describe("POST /auth/register", () => {
  const app = new AppBuilder().withSession().build()
  app.post("/auth/register", registerUserEndpoint)
  app.post("/auth/login", loginEndpoint)

  describe("happy path", () => {
    let registration: ReturnType<typeof createRegistration>

    beforeEach(() => {
      registration = createRegistration()
    })

    afterEach(async () => {
      const user = await dao.findByUsername(registration.username)
      if (user) await dao.deleteById(user.id)
    })

    it("sends a 200 response with public user data", async () => {
      const { body } = await request(app)
        .post("/auth/register")
        .send(registration)
        .expect(200)

      expect(body).toMatchObject({
        email: registration.email,
        username: registration.username,
        firstName: registration.firstName,
        lastName: registration.lastName,
      })
      expect(body).not.toHaveProperty("hashedPassword")
    })

    it("sets a session cookie", async () => {
      await request(app)
        .post("/auth/register")
        .send(registration)
        .expect(200)
        .expect("Set-Cookie", /.+/)
    })

    it("allows the user to login after registration", async () => {
      await request(app).post("/auth/register").send(registration).expect(200)

      await request(app)
        .post("/auth/login")
        .send({ username: registration.username, password: registration.password })
        .expect(200)
    })

    it("stores the password as a bcrypt hash, not in plain text", async () => {
      await request(app).post("/auth/register").send(registration).expect(200)

      const user = await dao.findByUsername(registration.username)

      expect(user?.hashedPassword).not.toBe(registration.password)
      expect(user?.hashedPassword).toMatch(/^\$2[aby]?\$/)
    })
  })

  describe("conflict errors", () => {
    it("sends a 409 response if username already exists", async ({ registeredUser }) => {
      const registration = {
        ...createRegistration(),
        username: registeredUser.credentials.username,
      }

      await request(app).post("/auth/register").send(registration).expect(409)
    })

    it("sends a 409 response if email already exists", async ({ registeredUser }) => {
      const registration = {
        ...createRegistration(),
        email: registeredUser.publicData.email,
      }

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
