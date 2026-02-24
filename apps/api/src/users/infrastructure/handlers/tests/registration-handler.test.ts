import { AppBuilder } from "~/__test-utils__/builders/app-builder.ts"
import { RegistrationUseCaseMock } from "~/__test-utils__/mocks/registration-use-case-mock.ts"
import { UserMother } from "~/__test-utils__/mothers/user-mother.ts"
import type {
  RegistrationBody,
  RegistrationErrorBody,
} from "@linku/api-contract"
import request from "supertest"
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

  const res = await request(app).post("/").send(body).expect(409)

  expect(res.body).toEqual(FieldError("username", "Username already exists"))
})

test("sends 409 if email exists", async () => {
  service.register.mockResolvedValueOnce({
    ok: false,
    error: "EMAIL_EXISTS",
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
