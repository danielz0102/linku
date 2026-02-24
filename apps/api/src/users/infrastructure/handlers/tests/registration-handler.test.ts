import type { RegistrationBody } from "@linku/api-contract"
import request from "supertest"
import { AppBuilder } from "~/__test-utils__/builders/app-builder.ts"
import { RegistrationUseCaseMock } from "~/__test-utils__/mocks/registration-use-case-mock.ts"
import { UserMother } from "~/__test-utils__/mothers/user-mother.ts"
import { registrationHandler } from "../registration-handler.ts"

const service = new RegistrationUseCaseMock()

const app = new AppBuilder().withSession().build()
app.post("/", registrationHandler(service))

const body: RegistrationBody = {
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
    error: "USERNAME_EXISTS",
  })

  await request(app).post("/").send(body).expect(409)
})

test("sends 409 if email exists", async () => {
  service.register.mockResolvedValueOnce({
    ok: false,
    error: "EMAIL_EXISTS",
  })

  await request(app).post("/").send(body).expect(409)
})
