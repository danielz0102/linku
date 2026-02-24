import type { LoginBody, LoginErrorBody } from "@linku/api-contract"
import request from "supertest"
import { AppBuilder } from "~/__test-utils__/builders/app-builder.ts"
import { LoginUseCaseMock } from "~/__test-utils__/mocks/login-use-case-mock.ts"
import { UserMother } from "~/__test-utils__/mothers/user-mother.ts"
import { loginHandler } from "../login-handler.ts"

const service = new LoginUseCaseMock()

const app = new AppBuilder().withSession().build()
app.post("/", loginHandler(service))

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

  await request(app).post("/").send(body).expect(200).expect(user)
})

test("sends 401 if credentials are invalid", async () => {
  service.login.mockResolvedValueOnce({
    ok: false,
    error: "INVALID_CREDENTIALS",
  })

  const { body: responseBody } = await request(app)
    .post("/")
    .send(body)
    .expect(401)

  expect(responseBody).toEqual({
    code: "UNAUTHORIZED",
    message: "Invalid username or password",
  } satisfies LoginErrorBody)
})
