import { createApp } from "#app.js"
import { composeAuthRouter } from "#composition.js"
import { JWT_SECRET, SALT } from "#config/env.js"
import db from "#db/drizzle/index.js"
import { usersTable } from "#db/drizzle/schemas.js"
import bcrypt from "bcryptjs"
import { eq } from "drizzle-orm"
import request from "supertest"
import { createFakeUserRecord } from "./lib/create-fake-user-record.js"
import jwt from "jsonwebtoken"

const app = createApp(composeAuthRouter())

const plainPassword = "plainPassword"
const fakeUser = createFakeUserRecord({
  profilePicId: null,
  hashedPassword: await bcrypt.hash(plainPassword, SALT),
})

beforeAll(async () => {
  await db.insert(usersTable).values(fakeUser)
})

afterAll(async () => {
  await db.delete(usersTable).where(eq(usersTable.id, fakeUser.id))
})

describe("POST /login", () => {
  it("sends an access token when credentials are valid", async () => {
    const response = await request(app)
      .post("/api/login")
      .send({ username: fakeUser.username, password: "plainPassword" })
      .expect(200)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { hashedPassword, ...publicUser } = fakeUser

    expect(response.body).toMatchObject({
      user: {
        ...publicUser,
        signUpAt: publicUser.signUpAt.toISOString(),
      },
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    })
    expect(response.body).not.toHaveProperty("hashedPassword")

    const decodedToken = jwt.verify(response.body.accessToken, JWT_SECRET)
    expect(decodedToken).toMatchObject({ userId: fakeUser.id })
  })
})
