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

test("sends 400 if body is empty", async () => {
  const { body } = await request(app).get("/").expect(400)

  expect(body).toEqual({
    code: "VALIDATION_ERROR",
    message: "Invalid login data",
  } satisfies LoginErrorBody)
})

test("sends 400 if username is empty", async () => {
  const { body } = await login({ username: "" }).expect(400)

  expect(body).toEqual({
    code: "VALIDATION_ERROR",
    message: "Invalid login data",
    errors: {
      username: "Username is empty",
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
  return request(app).get("/").send({
    username: "testuser",
    password: "password123",
    ...overrides,
  })
}
