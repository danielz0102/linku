import { AppBuilder } from "~/__test-utils__/builders/app-builder.ts"
import { UpdateUserServiceMock } from "~/__test-utils__/mocks/update-user-service-mock.ts"
import { UserMother } from "~/__test-utils__/mothers/user-mother.ts"
import type { UpdateUserBody, UpdateUserErrorBody } from "@linku/api-contract"
import request from "supertest"
import { updateUserHandler } from "~/users/features/update-user/update-user-handler.ts"

const service = new UpdateUserServiceMock()

const app = new AppBuilder().withSession().build()
app.patch(
  "/",
  (req, _res, next) => {
    req.session.userId = "test-user-id"
    next()
  },
  updateUserHandler(service)
)

const body: UpdateUserBody = {
  username: "newusername",
  email: "new@example.com",
  firstName: "New",
  lastName: "Name",
  bio: "Hello!",
}

test("sends 200 with updated user data", async () => {
  const user = UserMother.createPublicUser()
  service.update.mockResolvedValueOnce({ ok: true, data: user })

  await request(app).patch("/").send(body).expect(200).expect(user)
})

test("sends 409 if username exists", async () => {
  service.update.mockResolvedValueOnce({
    ok: false,
    error: "USERNAME_EXISTS",
  })

  const res = await request(app).patch("/").send(body).expect(409)

  expect(res.body).toEqual(FieldError("username", "Username already exists"))
})

test("sends 409 if email exists", async () => {
  service.update.mockResolvedValueOnce({
    ok: false,
    error: "EMAIL_EXISTS",
  })

  const res = await request(app).patch("/").send(body).expect(409)

  expect(res.body).toEqual(FieldError("email", "Email already exists"))
})

function FieldError(
  key: keyof UpdateUserBody,
  value: string | RegExp
): UpdateUserErrorBody {
  return {
    code: "VALIDATION_ERROR",
    message: expect.any(String),
    errors: {
      [key]: expect.stringMatching(value),
    },
  }
}
