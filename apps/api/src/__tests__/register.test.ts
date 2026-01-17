import { createFakeRegisterCredentials } from "#__tests__/lib/create-fake-register-credentials.js"
import { composeAuthRouter } from "#composition.js"
import db from "#db/drizzle/index.js"
import { usersTable } from "#db/drizzle/schemas.js"
import { eq } from "drizzle-orm"
import express from "express"
import request from "supertest"

const apiRouter = composeAuthRouter()
const app = express()
app.use(express.json())
app.use(apiRouter)

const fakeCredentials = createFakeRegisterCredentials({
  profilePicUrl: undefined,
})

beforeEach(async () => {
  await db.delete(usersTable).where(eq(usersTable.email, fakeCredentials.email))
})

describe("POST /register", () => {
  it("sends user public data with access token", async () => {
    const response = await request(app)
      .post("/register")
      .send(fakeCredentials)
      .expect(201)

    expect(response.body).toMatchObject({
      accessToken: expect.any(String),
    })
  })
})
