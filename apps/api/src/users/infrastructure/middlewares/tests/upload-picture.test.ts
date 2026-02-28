import type { LinkuAPI } from "@linku/api-contract"
import express from "express"
import request from "supertest"
import { uploadPicture } from "~/users/infrastructure/middlewares/upload-picture.ts"

const app = express()
app.use("/", uploadPicture, (req, res) => {
  res.status(200).json({ file: req.file })
})

it("sends file to next middleware", async () => {
  const file = Buffer.from("fake image content")

  const response = await request(app)
    .post("/")
    .attach("picture", file, {
      filename: "test.png",
      contentType: "image/png",
    })
    .expect(200)

  const { originalname, mimetype } = response.body.file as Express.Multer.File

  expect(originalname).toBe("test.png")
  expect(mimetype).toBe("image/png")
})

it("sends 400 when picture MIME type is not allowed", async () => {
  const file = Buffer.from("fake image content")

  await request(app)
    .post("/")
    .attach("picture", file, {
      filename: "test.txt",
      contentType: "text/plain",
    })
    .expect(400)
    .expect(
      buildErrorBody(
        "Picture file is invalid. Allowed files are: JPEG, PNG, JPG, WEBP"
      )
    )
})

it("sends 400 when picture size exceeds 5MB", async () => {
  const largeFile = Buffer.alloc(6 * 1024 * 1024, "a")

  await request(app)
    .post("/")
    .attach("picture", largeFile, {
      filename: "large-image.png",
      contentType: "image/png",
    })
    .expect(400)
    .expect(buildErrorBody("Picture file cannot be larger than 5MB"))
})

function buildErrorBody(error: string): LinkuAPI.ErrorBody {
  return {
    code: "VALIDATION_ERROR",
    message: "Validation failed",
    errors: {
      picture: error,
    },
  }
}
