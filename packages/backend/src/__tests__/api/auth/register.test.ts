import type { RegisterUserRequest } from "~/presentation/auth/dtos/register-user-request"

import express from "express"
import request from "supertest"
import { mockHasher } from "~/__tests__/mocks/password-hasher"
import { mockUserRepo } from "~/__tests__/mocks/user-repository"
import { RegisterUser } from "~/application/use-cases/register-user"
import User from "~/domain/entities/user"
import { Email } from "~/domain/value-objects/email"
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

const user: RegisterUserRequest = {
  username: "newuser",
  email: "newuser@example.com",
  password: "securePassword123!",
}

const userEntity = new User({
  id: "user-id",
  username: user.username,
  email: new Email(user.email),
  passwordHash: "hashedpassword",
})

mockUserRepo.register.mockResolvedValue(userEntity)

describe("POST /register", () => {
  it("sends 201 when user is created", async () => {
    const response = await request(app).post("/register").send(user).expect(201)
    expect(response.body).toEqual({
      id: userEntity.id,
      username: userEntity.username,
      email: userEntity.email.value,
      status: userEntity.status,
    })
  })

  it("sends 400 when user already exists", async () => {
    mockUserRepo.exists.mockResolvedValueOnce(true)
    const response = await request(app).post("/register").send(user).expect(400)
    expect(response.body).toEqual({ message: "User already exists" })
  })
})
