import request from "supertest"
import app from "~/presentation/app"

describe("GET /health", () => {
  it("should return 200 status", async () => {
    const response = await request(app).get("/health")
    expect(response.status).toBe(200)
  })
})
