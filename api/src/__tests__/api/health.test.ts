import request from "supertest"
import express from "express"
import router from "~/routers/index.js"

const app = express()
app.use(router)

describe("GET /health", () => {
  it("returns 200 OK", async () => {
    const response = await request(app).get("/health")
    expect(response.status).toBe(200)
  })
})
