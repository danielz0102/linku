import { AppBuilder } from "#__test-utils__/builders/app-builder.js"
import { LoginServiceMock } from "#__test-utils__/mocks/login-service-mock.js"
import { UserMother } from "#__test-utils__/mothers/user-mother.js"
import type { LoginErrorBody, LoginQuery } from "api-contract"
import request from "supertest"
import { loginHandler } from "../login-handler.js"

const service = new LoginServiceMock()
const handler = loginHandler(service)

const app = new AppBuilder().withSession().build()
app.get("/", handler)

const query: LoginQuery = {
  email: "john@example.com",
  password: "password123",
}

test("sends 200 with user data", async () => {
  const user = UserMother.createPublicUser()
  service.login.mockResolvedValueOnce({
    ok: true,
    data: user,
  })

  await request(app).get("/").query(query).expect(200).expect(user)
})

test("sends 401 if credentials are invalid", async () => {
  service.login.mockResolvedValueOnce({
    ok: false,
    error: "invalidCredentials",
  })

  const { body } = await request(app).get("/").query(query).expect(401)

  expect(body).toEqual({
    code: "VALIDATION_ERROR",
    message: "Invalid email or password",
  } satisfies LoginErrorBody)
})
