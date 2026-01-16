import { createApp } from "#app.js"
import { composeAuthRouter } from "#composition.js"
import { JWT_SECRET, SALT } from "#config/env.js"
import db from "#db/drizzle/index.js"
import { usersTable } from "#db/drizzle/schemas.js"
import { RefreshTokenCookie } from "#domain/constants/cookies.js"
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
const publicUser = toPublicUser(fakeUser)

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

    expect(response.body).toMatchObject({
      user: {
        ...publicUser,
        signUpAt: publicUser.signUpAt.toISOString(),
      },
      accessToken: expect.any(String),
    })
    expect(response.body).not.toHaveProperty("hashedPassword")

    const decodedToken = jwt.verify(response.body.accessToken, JWT_SECRET)
    expect(decodedToken).toMatchObject({ userId: fakeUser.id })
  })

  it("sets cookie with refresh token", async () => {
    const response = await request(app)
      .post("/api/login")
      .send({ username: fakeUser.username, password: "plainPassword" })
      .expect(200)

    const cookies = response.headers["set-cookie"] as unknown as string[]
    const refreshTokenCookie = findRefreshTokenCookie(cookies)
    const refreshToken = refreshTokenCookie.split(";")[0].split("=")[1]
    const decodedToken = jwt.verify(refreshToken, JWT_SECRET)

    expect(refreshTokenCookie).toMatch(/HttpOnly/)
    expect(decodedToken).toMatchObject({ userId: fakeUser.id })
  })

  it("succeeds with email too", async () => {
    await request(app)
      .post("/api/login")
      .send({ email: fakeUser.email, password: plainPassword })
      .expect(200)
  })

  it("does not ignore email if username is provided", async () => {
    await request(app)
      .post("/api/login")
      .send({
        username: fakeUser.username,
        email: "incorrectEmail@gmail.com",
        password: plainPassword,
      })
      .expect(401)
  })
})

function findRefreshTokenCookie(cookies: string[]) {
  const cookie = cookies.find((c) =>
    c.startsWith(`${RefreshTokenCookie.name}=`)
  )

  if (!cookie) {
    throw new Error("Refresh token cookie not found")
  }

  return cookie
}
