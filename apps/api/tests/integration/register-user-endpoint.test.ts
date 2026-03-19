import type { LinkuAPI } from "@linku/api-contract"

import { faker } from "@faker-js/faker"
import request from "supertest"

import { authRouter } from "~/api/auth/auth-router.ts"
import { toPublicUser } from "~/core/use-cases/dtos/public-user.ts"
import { createAuthContext } from "~tests/fixtures/auth-context.ts"
import { AppBuilder } from "~tests/helpers/app-builder.ts"

const it = createAuthContext()

const createRegistration = (): LinkuAPI.RegisterUser["RequestBody"] => ({
  email: faker.internet.email(),
  username: faker.internet.username(),
  password: "Password1!",
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
})

it.describe("POST /register", () => {
  const app = new AppBuilder().withSession().build()
  app.use(authRouter)

  describe("successful registration", () => {
    it("sends a 200 response with public user data", async ({ db }) => {
      const data = createRegistration()

      const { body } = await request(app).post("/register").send(data).expect(200)

      const user = await db.findByUsername(data.username)
      expect(body).toMatchObject(toPublicUser(user))
    })

    it("sets a session cookie", async () => {
      await request(app)
        .post("/register")
        .send(createRegistration())
        .expect(200)
        .expect("Set-Cookie", /.+/)
    })

    it("allows the user to login after registration", async () => {
      const data = createRegistration()

      await request(app).post("/register").send(data).expect(200)

      const { username, password } = data
      await request(app).post("/login").send({ username, password }).expect(200)
    })

    it("hashes the password", async ({ db }) => {
      const data = createRegistration()

      await request(app).post("/register").send(data).expect(200)

      const user = await db.findByUsername(data.username)
      expectTypeOf(user).not.toBeUndefined()
      expect(user?.password).not.toBe(data.password)
    })
  })

  describe("validation", () => {
    it("sends a 409 response if user already exists", async ({
      registeredUser: {
        credentials: { username },
      },
    }) => {
      const registration = { ...createRegistration(), username }
      await request(app).post("/register").send(registration).expect(409)
    })

    it("sends a 400 response if email is not valid", async () => {
      const registration = { ...createRegistration(), email: "not-an-email" }
      await request(app).post("/register").send(registration).expect(400)
    })

    it.each([
      { field: "firstName", description: "first name exceeds 50 characters" },
      { field: "lastName", description: "last name exceeds 50 characters" },
    ])("sends a 400 response if $description", async ({ field }) => {
      const registration = { ...createRegistration(), [field]: "a".repeat(51) }
      await request(app).post("/register").send(registration).expect(400)
    })

    it.each([
      { password: "Ab1!", description: "too short (< 8 characters)" },
      { password: "abcdefg1!", description: "missing uppercase letter" },
      { password: "ABCDEFG1!", description: "missing lowercase letter" },
      { password: "Abcdefg!", description: "missing number" },
      { password: "Abcdefg1", description: "missing special character" },
    ])("sends a 400 response if password is $description", async ({ password }) => {
      const registration = { ...createRegistration(), password }
      await request(app).post("/register").send(registration).expect(400)
    })
  })
})
