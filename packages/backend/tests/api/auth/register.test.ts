import type { RegisterUserRequest } from "~/presentation/auth/dtos/register-user-request"

import request from "supertest"
import express from "express"
import authRouter from "~/presentation/auth/auth-router"

const app = express()
app.use(authRouter)

const user: RegisterUserRequest = {
  username: "newuser",
  email: "newuser@example.com",
  password: "securePassword123!",
}

describe.skip("POST /register", () => {
  it("sends 201 when user is created", async () => {
    await request(app).post("/register").send(user).expect(201)
  })
})
