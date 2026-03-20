import type { LinkuAPI } from "@linku/api-contract"

import { faker } from "@faker-js/faker"
import request from "supertest"

import { LoginEndpoint } from "~/api/auth/endpoints/login/login-endpoint.ts"
import { RegisterEndpoint } from "~/api/auth/endpoints/register/register-endpoint.ts"
import { toPublicUser } from "~/core/use-cases/dtos/public-user.ts"
import { Login } from "~/core/use-cases/login-use-case.ts"
import { Register } from "~/core/use-cases/register-use-case.ts"
import { BcryptHasher } from "~/shared/adapters/bcrypt-hasher.ts"
import { DrizzleUserRepository } from "~/shared/adapters/drizzle-user-repository.ts"
import { it as base } from "~tests/fixtures/auth-context.ts"
import { createTestApp } from "~tests/helpers/app-builder.ts"

const it = base
  .extend("app", ({ dbClient }) => {
    const app = createTestApp()
    const userRepo = new DrizzleUserRepository(dbClient)
    const hasher = new BcryptHasher(1)
    const register = new Register({ userRepo, hasher })
    const login = new Login({ userRepo, hasher })

    app.post("/register", new RegisterEndpoint(register).build())
    app.post("/login", new LoginEndpoint(login).build(false))
    return app
  })
  .extend("data", (): LinkuAPI.RegisterUser["RequestBody"] => ({
    email: faker.internet.email(),
    username: faker.internet.username(),
    password: generateRandomPassword(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
  }))

function generateRandomPassword(): string {
  const uppercase = faker.string.alpha({ casing: "upper" })
  const lowercase = faker.string.alpha({ casing: "lower" })
  const numbers = faker.string.numeric()
  const special = faker.string.fromCharacters("!@#$%^&*()_+-=[]{}|;':,.<>?")
  const remaining = faker.string.alphanumeric({ length: 5 })

  const allChars = uppercase + lowercase + numbers + special + remaining
  return faker.helpers.shuffle(allChars.split("")).join("")
}

it.describe("POST /register", () => {
  describe("successful registration", () => {
    it("sends a 200 response with public user data", async ({ app, db, data }) => {
      const { body } = await request(app).post("/register").send(data).expect(200)

      const user = await db.findByUsername(data.username)
      assert(user !== undefined)
      expect(body).toMatchObject(toPublicUser(user))
    })

    it("sets a session cookie", async ({ app, data }) => {
      await request(app).post("/register").send(data).expect(200).expect("Set-Cookie", /.+/)
    })

    it("allows the user to login after registration", async ({ app, data }) => {
      await request(app).post("/register").send(data).expect(200)

      const { username, password } = data
      await request(app).post("/login").send({ username, password }).expect(200)
    })

    it("hashes the password", async ({ app, db, data }) => {
      await request(app).post("/register").send(data).expect(200)

      const user = await db.findByUsername(data.username)
      assert(user !== undefined)
      expect(user?.password).not.toBe(data.password)
    })
  })

  describe("validation", () => {
    it("sends a 409 response if user already exists", async ({
      app,
      data,
      registeredUser: {
        credentials: { username },
      },
    }) => {
      const conflictingData = { ...data, username }
      await request(app).post("/register").send(conflictingData).expect(409)
    })

    it("sends a 400 response if email is not valid", async ({ app, data }) => {
      const invalidData = { ...data, email: "not-an-email" }
      await request(app).post("/register").send(invalidData).expect(400)
    })

    it.for([
      { field: "firstName", description: "first name exceeds 50 characters" },
      { field: "lastName", description: "last name exceeds 50 characters" },
    ])("sends a 400 response if $description", async ({ field }, { app, data }) => {
      const invalidData = { ...data, [field]: "a".repeat(51) }
      await request(app).post("/register").send(invalidData).expect(400)
    })

    it.for([
      { password: "Ab1!", description: "too short (< 8 characters)" },
      { password: "abcdefg1!", description: "missing uppercase letter" },
      { password: "ABCDEFG1!", description: "missing lowercase letter" },
      { password: "Abcdefg!", description: "missing number" },
      { password: "Abcdefg1", description: "missing special character" },
    ])("sends a 400 response if password is $description", async ({ password }, { app, data }) => {
      const invalidData = { ...data, password }
      await request(app).post("/register").send(invalidData).expect(400)
    })
  })
})
