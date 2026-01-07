import type { NextFunction, Request, Response } from "express"

import cookieParser from "cookie-parser"
import { eq } from "drizzle-orm"
import express from "express"
import jwt from "jsonwebtoken"
import request from "supertest"
import { JWT_SECRET } from "~/config/env.ts"
import db from "~/db/drizzle/index.ts"
import { usersTable } from "~/db/drizzle/schema.ts"
import { Result } from "~/lib/Result.ts"
import authRouter from "~/routers/auth-router.ts"
import { createFakeUser } from "../lib/user-mother.ts"

const { verifyTokenMock } = vi.hoisted(() => ({
  verifyTokenMock: vi.fn(),
}))

vi.mock(
  import("~/services/auth-services/google-auth-service.js"),
  async (importOriginal) => {
    const { GoogleAuthService } = await importOriginal()

    return {
      GoogleAuthService: vi.fn(
        class extends GoogleAuthService {
          verifyToken = verifyTokenMock
        }
      ),
    }
  }
)

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use("/auth", authRouter)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err)
  res.sendStatus(500)
})

describe("POST /auth/google", () => {
  const fakeUser = createFakeUser()

  beforeAll(() => {
    verifyTokenMock.mockResolvedValue(Result.ok(fakeUser))
  })

  afterAll(async () => {
    await db.delete(usersTable).where(eq(usersTable.email, fakeUser.email))
  })

  it("sends 200 and an access token with user data on success", async () => {
    const response = await request(app)
      .post("/auth/google")
      .set("Authorization", "Bearer valid-id-token")
      .expect(200)

    const { accessToken } = response.body
    const decoded = jwt.decode(accessToken)

    expect(decoded).toMatchObject(fakeUser)
  })

  it('sets "refresh_token" cookie on success', async () => {
    await request(app)
      .post("/auth/google")
      .set("Authorization", "Bearer valid-id-token")
      .expect(200)
      .expect("set-cookie", /refresh_token=.*HttpOnly/)
  })

  it("registers the user in the database if they do not exist", async () => {
    await db.delete(usersTable).where(eq(usersTable.email, fakeUser.email))

    await request(app)
      .post("/auth/google")
      .set("Authorization", "Bearer valid-id-token")
      .expect(200)

    const userInDb = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, fakeUser.email))
      .limit(1)
      .then((res) => res[0])

    expect(userInDb).toMatchObject(fakeUser)
  })

  it("sends 401 on invalid token", async () => {
    verifyTokenMock.mockResolvedValueOnce(
      Result.fail(new Error("Invalid token"))
    )

    const response = await request(app)
      .post("/auth/google")
      .set("Authorization", "Bearer invalid-id-token")
      .expect(401)

    expect(response.body).toMatchObject({ message: /token is not valid/i })
  })

  it("sends 401 when no token is provided", async () => {
    await request(app).post("/auth/google").expect(401)
  })
})

describe("GET /auth/me", () => {
  const fakeUser = createFakeUser()
  const token = jwt.sign({ userId: fakeUser.id }, JWT_SECRET, {
    expiresIn: "15m",
  })

  it("sends an access token if there is a refresh token", async () => {
    await db.insert(usersTable).values(fakeUser)

    const response = await request(app)
      .get("/auth/me")
      .set("Cookie", `refresh_token=${token}`)
      .expect(200)

    const { accessToken } = response.body
    const decoded = jwt.decode(accessToken) as { userId: string }

    expect(decoded).toMatchObject(fakeUser)

    await db.delete(usersTable).where(eq(usersTable.email, fakeUser.email))
  })
})
