import express from "express"
import request from "supertest"

import { mockHasher } from "~/__tests__/mocks/password-hasher"
import { mockUserRepo } from "~/__tests__/mocks/user-repository"
import { RegisterUserRequestMother as RequestMother } from "~/__tests__/utils/register-user-request-mother"
import { UserMother } from "~/__tests__/utils/user-mother"

import { RegisterUser } from "~/application/use-cases/register-user"
import { AuthController } from "~/presentation/auth/auth-controller"
import { createAuthRouter } from "~/presentation/auth/auth-router"
import { handle500 } from "~/presentation/middlewares/handle-500"

const registerUser = new RegisterUser(mockUserRepo, mockHasher)
const controller = new AuthController(registerUser)
const router = createAuthRouter(controller)

const app = express()
app.use(express.json())
app.use(router)
app.use(handle500)

const req = RequestMother.create()
const user = UserMother.create({
  username: req.username,
  email: req.email,
})

mockUserRepo.register.mockResolvedValue(user)

describe("POST /register", () => {
  it("sends 201 when user is created", async () => {
    const response = await request(app).post("/register").send(req).expect(201)
    expect(response.body).toEqual({
      id: user.id,
      username: user.username,
      email: user.email.value,
      status: user.status,
    })
  })

  it("sends 400 when user already exists", async () => {
    mockUserRepo.exists.mockResolvedValueOnce(true)
    const response = await request(app).post("/register").send(req).expect(400)
    expect(response.body).toEqual({ message: "User already exists" })
  })

  it("sends 400 when email is invalid", async () => {
    const req = RequestMother.create({ email: "invalid-email" })
    await request(app).post("/register").send(req).expect(400)
  })

  it("sends 400 when username is empty", async () => {
    const req = RequestMother.create({ username: "   " })
    await request(app).post("/register").send(req).expect(400)
  })

  it("sends 400 when password is too weak", async () => {
    const req = RequestMother.create({ password: "weak" })
    await request(app).post("/register").send(req).expect(400)
  })
})
