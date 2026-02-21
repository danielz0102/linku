import { AppBuilder } from "#__test-utils__/builders/app-builder.js"
import type { RegistrationBody, RegistrationErrorBody } from "@linku/api-contract"
import request from "supertest"
import { validateRegistration } from "../validate-registration.js"

const app = new AppBuilder().build()
app.post("/", validateRegistration, (_, res) => {
  res.sendStatus(200)
})

test("calls the next middleware", async () => {
  await register().expect(200)
})

test("sends 400 if body is empty", async () => {
  const { body } = await request(app).post("/").expect(400)

  expect(body).toEqual({
    code: "VALIDATION_ERROR",
    message: "Registration data is missing",
  } satisfies RegistrationErrorBody)
})

test("sends 400 if some fields are missing", async () => {
  const { body } = await register({
    username: "",
    firstName: undefined,
    lastName: undefined,
  }).expect(400)

  expect(body).toEqual({
    code: "VALIDATION_ERROR",
    message: expect.any(String),
    errors: {
      username: "Username is empty",
      firstName: expect.any(String),
      lastName: expect.any(String),
    },
  } satisfies RegistrationErrorBody)
})

test("sends 400 if email is invalid", async () => {
  const { body } = await register({ email: "invalid-email" }).expect(400)

  expect(body).toEqual(FieldError("email", "Invalid email address"))
})

describe("password validation", () => {
  it("sends 400 if password is less than 8 characters", async () => {
    const { body } = await register({ password: "Pass1!" }).expect(400)

    expect(body).toEqual(FieldError("password", /password.*8.*character/i))
  })

  it("sends 400 if password doesn't have an uppercase", async () => {
    const { body } = await register({ password: "password123!!" }).expect(400)

    expect(body).toEqual(FieldError("password", /password.*uppercase/i))
  })

  it("sends 400 if password doesn't have a lowercase", async () => {
    const { body } = await register({ password: "PASSWORD123!!" }).expect(400)

    expect(body).toEqual(FieldError("password", /password.*lowercase/i))
  })

  it("sends 400 if password doesn't have a number", async () => {
    const { body } = await register({ password: "Password!!" }).expect(400)

    expect(body).toEqual(FieldError("password", /password.*number/i))
  })

  it("sends 400 if password doesn't have a special character", async () => {
    const { body } = await register({ password: "Password123" }).expect(400)

    expect(body).toEqual(
      FieldError("password", /password.*special.*character/i)
    )
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

function FieldError(
  key: keyof RegistrationBody,
  value: string | RegExp
): RegistrationErrorBody {
  return {
    code: "VALIDATION_ERROR",
    message: expect.any(String),
    errors: {
      [key]: expect.stringMatching(value),
    },
  }
}
