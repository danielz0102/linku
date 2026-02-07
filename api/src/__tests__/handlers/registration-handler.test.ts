import { RegistrationServiceMock } from "#__tests__/mocks/registration-service-mock.js"
import { UserMother } from "#__tests__/mothers/user-mother.js"
import { RegistrationHandler } from "#users/register/registration-handler.js"
import express from "express"
import request from "supertest"

const service = new RegistrationServiceMock()
const handler = new RegistrationHandler(service)

const app = express()
app.use(express.json())
app.post("/register", handler.handle)

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

  await request(app).post("/register").send(body).expect(200).expect(user)
})

test("sends 409 if username exists", async () => {
  service.register.mockResolvedValueOnce({
    ok: false,
    error: { usernameExists: true },
  })

  const res = await request(app).post("/register").send(body).expect(409)

  expect(res.body).toEqual({
    message: expect.any(String),
    errors: [{ field: "username", details: "Username already exists" }],
  })
})

test("sends 409 if email exists", async () => {
  service.register.mockResolvedValueOnce({
    ok: false,
    error: { emailExists: true },
  })

  const res = await request(app).post("/register").send(body).expect(409)

  expect(res.body).toEqual({
    message: expect.any(String),
    errors: [{ field: "email", details: "Email already exists" }],
  })
})
