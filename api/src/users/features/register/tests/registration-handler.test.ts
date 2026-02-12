import { RegistrationServiceMock } from "#__tests__/mocks/registration-service-mock.js"
import { UserMother } from "#__tests__/mothers/user-mother.js"
import { RegistrationHandler } from "#users/features/register/registration-handler.js"
import express from "express"
import request from "supertest"
import type { RegistrationBody, RegistrationErrorBody } from "api-contract"

const service = new RegistrationServiceMock()
const handler = new RegistrationHandler(service)

const app = express()
app.use(express.json())
app.post("/", handler.handle)

const body = {
  username: "testuser",
  email: "john@example.com",
  password: "password123",
  firstName: "John",
  lastName: "Doe",
}

test("sends 200 with user data", async () => {
  const user = UserMother.createPublicUser()
  service.register.mockResolvedValueOnce({
    ok: true,
    data: user,
  })

  await request(app).post("/").send(body).expect(200).expect(user)
})

test("sends 409 if username exists", async () => {
  service.register.mockResolvedValueOnce({
    ok: false,
    error: { usernameExists: true },
  })

  const res = await request(app).post("/").send(body).expect(409)

  expect(res.body).toEqual(FieldError("username", "Username already exists"))
})

test("sends 409 if email exists", async () => {
  service.register.mockResolvedValueOnce({
    ok: false,
    error: { emailExists: true },
  })

  const res = await request(app).post("/").send(body).expect(409)

  expect(res.body).toEqual(FieldError("email", "Email already exists"))
})

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
