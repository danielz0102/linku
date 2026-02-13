import { AppBuilder } from "#__test-utils__/builders/app-builder.js"
import type { LoginErrorBody } from "api-contract"
import request from "supertest"
import { validateLogin } from "../validate-login.js"

const app = new AppBuilder().build()
app.get("/", validateLogin, (_, res) => {
  res.sendStatus(200)
})

test("calls the next middleware", async () => {
  await login().expect(200)
})

test("sends 400 if query is empty", async () => {
  const { body } = await request(app).get("/").expect(400)

  expect(body).toEqual({
    code: "VALIDATION_ERROR",
    message: "Invalid login data",
    errors: {
      email: expect.any(String),
      password: expect.any(String),
    },
  } satisfies LoginErrorBody)
})

test("sends 400 if email is invalid", async () => {
  const { body } = await login({ email: "invalid-email" }).expect(400)

  expect(body).toEqual({
    code: "VALIDATION_ERROR",
    message: "Invalid login data",
    errors: {
      email: "Invalid email address",
    },
  } satisfies LoginErrorBody)
})

test("sends 400 if password is empty", async () => {
  const { body } = await login({ password: "" }).expect(400)

  expect(body).toEqual({
    code: "VALIDATION_ERROR",
    message: "Invalid login data",
    errors: {
      password: "Password is empty",
    },
  } satisfies LoginErrorBody)
})

function login(overrides = {}) {
  return request(app).get("/").query({
    email: "user@test.com",
    password: "password123",
    ...overrides,
  })
}
