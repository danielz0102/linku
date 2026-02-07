import { validateRegistration } from "#users/features/register/validate-registration.js"
import request from "supertest"
import express from "express"

const app = express()
app.use(express.json())
app.post("/", validateRegistration, (_, res) => {
  res.sendStatus(200)
})

test("calls the next middleware", async () => {
  await register().expect(200)
})

test("sends 400 if body is empty", async () => {
  const { body } = await request(app).post("/").expect(400)

  expect(body).toEqual({
    message: "Registration data is missing",
    errors: [],
  })
})

test("sends 400 if some fields are missing", async () => {
  const { body } = await register({
    username: "",
    firstName: undefined,
    lastName: undefined,
  }).expect(400)

  expect(body).toEqual({
    message: expect.any(String),
    errors: [
      { field: "username", details: "Username is empty" },
      { field: "firstName", details: expect.any(String) },
      { field: "lastName", details: expect.any(String) },
    ],
  })
})

test("sends 400 if email is invalid", async () => {
  const { body } = await register({ email: "invalid-email" }).expect(400)

  expectBody(body, {
    field: "email",
    details: "Invalid email address",
  })
})

describe("password validation", () => {
  test("sends 400 if password is less than 8 characters", async () => {
    const { body } = await register({ password: "Pass1!" }).expect(400)

    expectBody(body, {
      field: "password",
      details: /password.*8.*character/i,
    })
  })

  test("sends 400 if password doesn't have an uppercase", async () => {
    const { body } = await register({ password: "password123!!" }).expect(400)

    expectBody(body, {
      field: "password",
      details: /password.*uppercase/i,
    })
  })

  test("sends 400 if password doesn't have a lowercase", async () => {
    const { body } = await register({ password: "PASSWORD123!!" }).expect(400)

    expectBody(body, {
      field: "password",
      details: /password.*lowercase/i,
    })
  })

  test("sends 400 if password doesn't have a number", async () => {
    const { body } = await register({ password: "Password!!" }).expect(400)

    expectBody(body, {
      field: "password",
      details: /password.*number/i,
    })
  })

  test("sends 400 if password doesn't have a special character", async () => {
    const { body } = await register({ password: "Password123" }).expect(400)

    expectBody(body, {
      field: "password",
      details: /password.*special.*character/i,
    })
  })
})

function register(overrides = {}) {
  return request(app)
    .post("/")
    .send({
      username: "testuser",
      email: "user@test.com",
      password: "Password123!!",
      firstName: "John",
      lastName: "Doe",
      ...overrides,
    })
}

function expectBody(
  body: unknown,
  ...fields: { field: string; details: string | RegExp }[]
) {
  expect(body).toEqual({
    message: expect.any(String),
    errors: fields.map(({ field, details }) => ({
      field,
      details:
        typeof details === "string" ? details : expect.stringMatching(details),
    })),
  })
}
