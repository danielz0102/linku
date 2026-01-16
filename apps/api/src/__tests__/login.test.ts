import { createApp } from "#app.js"
import { composeAuthRouter } from "#composition.js"
import { JWT_SECRET, SALT } from "#config/env.js"
import db from "#db/drizzle/index.js"
import { usersTable } from "#db/drizzle/schemas.js"
import { toPublicUser } from "#domain/entities/user-mapper.js"
import bcrypt from "bcryptjs"
import { eq } from "drizzle-orm"
import jwt from "jsonwebtoken"
import request from "supertest"
import { createFakeUser } from "./lib/create-fake-user-record.js"

const app = createApp(composeAuthRouter())

const plainPassword = "plainPassword"
const fakeUser = createFakeUser({
  hashedPassword: await bcrypt.hash(plainPassword, SALT),
})

beforeAll(async () => {
  await db.insert(usersTable).values(fakeUser)
})

afterAll(async () => {
  await db.delete(usersTable).where(eq(usersTable.id, fakeUser.id))
})

describe("POST /login", () => {
  it("sends an access token when username and password are valid", async () => {
    const response = await request(app)
      .post("/api/login")
      .send({ username: fakeUser.username, password: "plainPassword" })
      .expect(200)

    const publicUser = toPublicUser(fakeUser)

    expect(response.body).toMatchObject({
      user: {
        ...toPublicUser(fakeUser),
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
