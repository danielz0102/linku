import type { UpdateUserBody } from "@linku/api-contract"
import type { RequestHandler } from "express"
import request from "supertest"
import { AppBuilder } from "~/__test-utils__/builders/app-builder.ts"
import { clearUsers, createTestUser } from "~/__test-utils__/db/db-utils.ts"
import { updateUserEndpoint } from "~/users/infrastructure/endpoints/update-user-endpoint.ts"

function withUserId(userId: string): RequestHandler {
  return (req, _res, next) => {
    req.session.userId = userId
    next()
  }
}

const unauthApp = new AppBuilder().withSession().build()
unauthApp.patch("/", updateUserEndpoint)

afterEach(async () => {
  await clearUsers()
})

test("sends 200 with updated user data", async () => {
  const user = await createTestUser()
  const app = new AppBuilder().withSession().build()
  app.patch("/", withUserId(user.id), updateUserEndpoint)

  const body: UpdateUserBody = { firstName: "Updated" }

  await request(app)
    .patch("/")
    .send(body)
    .expect(200)
    .expect((res) => {
      expect(res.body.id).toBe(user.id)
      expect(res.body.firstName).toBe("Updated")
    })
})

test("sends 409 if username exists", async () => {
  const user = await createTestUser()
  const other = await createTestUser()
  const app = new AppBuilder().withSession().build()
  app.patch("/", withUserId(user.id), updateUserEndpoint)

  await request(app)
    .patch("/")
    .send({ username: other.username })
    .expect(409)
    .expect((res) => {
      expect(res.body.code).toBe("VALIDATION_ERROR")
    })
})

test("sends 409 if email exists", async () => {
  const user = await createTestUser()
  const other = await createTestUser()
  const app = new AppBuilder().withSession().build()
  app.patch("/", withUserId(user.id), updateUserEndpoint)

  await request(app)
    .patch("/")
    .send({ email: other.email })
    .expect(409)
    .expect((res) => {
      expect(res.body.code).toBe("VALIDATION_ERROR")
    })
})

test("sends 401 if not authenticated", async () => {
  await request(unauthApp)
    .patch("/")
    .send({ firstName: "Test" })
    .expect(401)
    .expect((res) => {
      expect(res.body.code).toBe("UNAUTHORIZED")
    })
})

test("sends 400 when email is invalid", async () => {
  const user = await createTestUser()
  const app = new AppBuilder().withSession().build()
  app.patch("/", withUserId(user.id), updateUserEndpoint)

  await request(app)
    .patch("/")
    .send({ email: "not-an-email" })
    .expect(400)
    .expect((res) => {
      expect(res.body.code).toBe("VALIDATION_ERROR")
    })
})

test("sends 400 when username is empty", async () => {
  const user = await createTestUser()
  const app = new AppBuilder().withSession().build()
  app.patch("/", withUserId(user.id), updateUserEndpoint)

  await request(app)
    .patch("/")
    .send({ username: "" })
    .expect(400)
    .expect((res) => {
      expect(res.body.code).toBe("VALIDATION_ERROR")
    })
})
