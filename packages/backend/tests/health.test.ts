import express from "express"
import request from "supertest"
import healthRouter from "~/presentation/app/routes/health.js"

const app = express()
app.use(healthRouter)

describe("GET /health", () => {
  it("sends 200 status", async () => {
    await request(app).get("/health").expect(200)
  })
})
