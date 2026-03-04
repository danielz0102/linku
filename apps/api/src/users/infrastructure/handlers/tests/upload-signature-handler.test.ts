import request from "supertest"
import { AppBuilder } from "~/__test-utils__/builders/app-builder.ts"
import { vi } from "vitest"
import { uploadSignatureHandler } from "../upload-signature-handler.ts"

vi.mock("#shared/providers/upload-image.js", () => ({
  createUploadSignature: () => ({
    signature: "signature",
    timestamp: 123456,
    cloudName: "cloud",
    apiKey: "key",
    folder: "linku/profile-pictures",
  }),
}))

const app = new AppBuilder().withSession().build()
app.post(
  "/",
  (req, _res, next) => {
    req.session.userId = "test-user-id"
    next()
  },
  uploadSignatureHandler
)

test("returns upload signature payload", async () => {
  const response = await request(app).post("/").expect(200)

  expect(response.body).toEqual(
    expect.objectContaining({
      signature: expect.any(String),
      timestamp: 123456,
      cloudName: "cloud",
      apiKey: "key",
      folder: "linku/profile-pictures",
    })
  )
})
