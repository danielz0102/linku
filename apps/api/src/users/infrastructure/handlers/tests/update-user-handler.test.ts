import type { LinkuAPI } from "@linku/api-contract"
import request from "supertest"
import { AppBuilder } from "~/__test-utils__/builders/app-builder.ts"
import { UpdateUserUseCaseMock } from "~/__test-utils__/mocks/update-user-use-case-mock.ts"
import { UserMother } from "~/__test-utils__/mothers/user-mother.ts"
import { updateUserHandler } from "../update-user-handler.ts"

const service = new UpdateUserUseCaseMock()

const app = new AppBuilder().withSession().build()
app.patch(
  "/",
  (req, _res, next) => {
    req.session.userId = "test-user-id"
    next()
  },
  updateUserHandler(service)
)

const body: LinkuAPI.UpdateUser["RequestBody"] = {
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

  await request(app).patch("/").send(body).expect(409)
})

test("sends 409 if email exists", async () => {
  service.update.mockResolvedValueOnce({
    ok: false,
    error: "EMAIL_EXISTS",
  })

  await request(app).patch("/").send(body).expect(409)
})
