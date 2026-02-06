import { userRouter } from "#routers/user-router.js"
import request from "supertest"
import express from "express"

const app = express()
app.use(express.json())
app.use("/user", userRouter)

describe("POST /user", () => {
  it("sends 404", async () => {
    await request(app).post("/user").expect(404)
  })
})
