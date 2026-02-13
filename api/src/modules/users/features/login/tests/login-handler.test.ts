import { AppBuilder } from "#__test-utils__/builders/app-builder.js"
import { LoginServiceMock } from "#__test-utils__/mocks/login-service-mock.js"
import { UserMother } from "#__test-utils__/mothers/user-mother.js"
import type { LoginBody, LoginErrorBody } from "api-contract"
import request from "supertest"
import { loginHandler } from "../login-handler.js"

const service = new LoginServiceMock()

const app = new AppBuilder().withSession().build()
app.get("/", loginHandler(service))

const body: LoginBody = {
  username: "testuser",
  password: "password123",
}

test("sends 200 with user data", async () => {
  const user = UserMother.createPublicUser()
  service.login.mockResolvedValueOnce({
    ok: true,
    data: user,
  })

  await request(app).get("/").send(body).expect(200).expect(user)
})

test("sends 401 if credentials are invalid", async () => {
  service.login.mockResolvedValueOnce({
    ok: false,
    error: "INVALID_CREDENTIALS",
  })

  const { body: responseBody } = await request(app)
    .get("/")
    .send(body)
    .expect(401)

  expect(responseBody).toEqual({
    code: "VALIDATION_ERROR",
    message: "Invalid username or password",
  } satisfies LoginErrorBody)
})
