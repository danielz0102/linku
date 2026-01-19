import { createApp } from "#presentation/app.js"
import { composeAuthRouter } from "#presentation/composition.js"
import { JWT_SECRET, SALT } from "#infraestructure/config/env.js"
import db from "#infraestructure/db/drizzle/index.js"
import { usersTable } from "#infraestructure/db/drizzle/schemas.js"
import { RefreshTokenCookie } from "#domain/constants/cookies.js"
import { toPublicUser } from "#domain/entities/user-mapper.js"
import bcrypt from "bcryptjs"
import { eq } from "drizzle-orm"
import jwt from "jsonwebtoken"
import request from "supertest"
import { createFakeUser } from "./lib/create-fake-user-record.js"

const actualPassword = "plainPassword123!"
const hashedPassword = await bcrypt.hash(actualPassword, SALT)
const fakeUser = createFakeUser({ hashedPassword })
const app = createApp(composeAuthRouter())

beforeAll(async () => {
  await db.insert(usersTable).values(fakeUser)
})

afterAll(async () => {
  await db.delete(usersTable).where(eq(usersTable.id, fakeUser.id))
})

describe("POST /login", () => {
  it("sends public user data and access token when credentials are valid", async () => {
    const response = await request(app)
      .post("/api/login")
      .send({ username: fakeUser.username, password: actualPassword })
      .expect(200)

    expect(response.body).toMatchObject({
      user: toPublicUser(fakeUser),
      accessToken: expect.any(String),
    })
    expect(response.body).not.toHaveProperty("hashedPassword")
  })

  it("assigns user id to access token", async () => {
    const response = await request(app)
      .post("/api/login")
      .send({ username: fakeUser.username, password: actualPassword })
      .expect(200)

    const decodedToken = jwt.verify(response.body.accessToken, JWT_SECRET)
    expect(decodedToken).toMatchObject({ userId: fakeUser.id })
  })

  it("sets cookie with HTTP only flag and refresh token with user id", async () => {
    const response = await request(app)
      .post("/api/login")
      .send({ username: fakeUser.username, password: actualPassword })
      .expect(200)

    const cookies = response.headers["set-cookie"] as unknown as string[]
    const refreshTokenCookie = findRefreshTokenCookie(cookies)
    const refreshToken = refreshTokenCookie.split(";")[0].split("=")[1]
    const decodedToken = jwt.verify(refreshToken, JWT_SECRET)

    expect(refreshTokenCookie).toMatch(/HttpOnly/)
    expect(decodedToken).toMatchObject({ userId: fakeUser.id })
  })

  it("sends 401 when password is invalid", async () => {
    await request(app)
      .post("/api/login")
      .send({ username: fakeUser.username, password: "wrongPassword123!!" })
      .expect(401)
  })

  it("sends 400 when credentials are missing", async () => {
    await request(app).post("/api/login").expect(400)
  })

  it("sends 400 when fields have invalid types", async () => {
    await request(app)
      .post("/api/login")
      .send({ username: 12345, password: true })
      .expect(400)
  })

  it("sends 400 when fields are empty strings", async () => {
    await request(app)
      .post("/api/login")
      .send({ username: "", password: "" })
      .expect(400)
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
