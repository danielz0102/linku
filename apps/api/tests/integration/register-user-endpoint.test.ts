import type { LinkuAPI } from "@linku/api-contract"

import { faker } from "@faker-js/faker"
import request from "supertest"

import { BcryptHasher } from "~/api/auth/adapters/bcrypt-hasher.ts"
import { logOutHandler } from "~/api/auth/endpoints/log-out/log-out-handler.ts"
import { LoginEndpoint } from "~/api/auth/endpoints/login/login-endpoint.ts"
import { RegisterEndpoint } from "~/api/auth/endpoints/register/register-endpoint.ts"
import { toPublicUser } from "~/core/use-cases/dtos/public-user.ts"
import { Login } from "~/core/use-cases/login-use-case.ts"
import { Register } from "~/core/use-cases/register-use-case.ts"
import { DrizzleUserRepository } from "~/shared/adapters/drizzle-user-repository.ts"
import { createAuthContext } from "~tests/fixtures/auth-context.ts"
import { createTestApp } from "~tests/helpers/app-builder.ts"

const it = createAuthContext().extend("app", ({ dbClient }) => {
  const app = createTestApp()
  const register = new Register({
    userRepo: new DrizzleUserRepository(dbClient),
    hasher: new BcryptHasher(1),
  })
  const login = new Login({
    userRepo: new DrizzleUserRepository(dbClient),
    hasher: new BcryptHasher(1),
  })
  app.post("/register", new RegisterEndpoint(register).build())
  app.post("/login", new LoginEndpoint(login).build(false))
  app.post("/logout", logOutHandler)
  return app
})

const createRegistration = (): LinkuAPI.RegisterUser["RequestBody"] => ({
  email: faker.internet.email(),
  username: faker.internet.username(),
  password: "Password1!",
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
})

it.describe("POST /register", () => {
  describe("successful registration", () => {
    it("sends a 200 response with public user data", async ({ app, db }) => {
      const data = createRegistration()

      const { body } = await request(app).post("/register").send(data).expect(200)

      const user = await db.findByUsername(data.username)
      assert(user !== undefined)
      expect(body).toMatchObject(toPublicUser(user))
    })

    it("sets a session cookie", async ({ app }) => {
      await request(app)
        .post("/register")
        .send(createRegistration())
        .expect(200)
        .expect("Set-Cookie", /.+/)
    })

    it("allows the user to login after registration", async ({ app }) => {
      const data = createRegistration()

      await request(app).post("/register").send(data).expect(200)

      const { username, password } = data
      await request(app).post("/login").send({ username, password }).expect(200)
    })

    it("hashes the password", async ({ app, db }) => {
      const data = createRegistration()

      await request(app).post("/register").send(data).expect(200)

      const user = await db.findByUsername(data.username)
      expectTypeOf(user).not.toBeUndefined()
      expect(user?.password).not.toBe(data.password)
    })
  })

  describe("validation", () => {
    it("sends a 409 response if user already exists", async ({
      app,
      registeredUser: {
        credentials: { username },
      },
    }) => {
      const registration = { ...createRegistration(), username }
      await request(app).post("/register").send(registration).expect(409)
    })

    it("sends a 400 response if email is not valid", async ({ app }) => {
      const registration = { ...createRegistration(), email: "not-an-email" }
      await request(app).post("/register").send(registration).expect(400)
    })

    it.for([
      { field: "firstName", description: "first name exceeds 50 characters" },
      { field: "lastName", description: "last name exceeds 50 characters" },
    ])("sends a 400 response if $description", async ({ field }, { app }) => {
      const registration = { ...createRegistration(), [field]: "a".repeat(51) }
      await request(app).post("/register").send(registration).expect(400)
    })

    it.for([
      { password: "Ab1!", description: "too short (< 8 characters)" },
      { password: "abcdefg1!", description: "missing uppercase letter" },
      { password: "ABCDEFG1!", description: "missing lowercase letter" },
      { password: "Abcdefg!", description: "missing number" },
      { password: "Abcdefg1", description: "missing special character" },
    ])("sends a 400 response if password is $description", async ({ password }, { app }) => {
      const registration = { ...createRegistration(), password }
      await request(app).post("/register").send(registration).expect(400)
    })
  })
})
