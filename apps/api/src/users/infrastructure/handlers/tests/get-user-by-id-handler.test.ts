import request from "supertest"
import { AppBuilder } from "~/__test-utils__/builders/app-builder.ts"
import { UserRepositoryMock } from "~/__test-utils__/mocks/user-repository-mock.ts"
import { UserMother } from "~/__test-utils__/mothers/user-mother.ts"
import { getUserByIdHandler } from "../get-user-by-id-handler.ts"

const repo = new UserRepositoryMock()
const app = new AppBuilder().withSession().build()
app.get("/:id", getUserByIdHandler(repo))

test("sends 200 with user data", async () => {
  const user = UserMother.create()
  repo.findOne.mockResolvedValueOnce(user)

  await request(app).get(`/${user.#id}`).expect(200).expect(user.toPublic())
})

test("sends 404 if user is not found", async () => {
  repo.findOne.mockResolvedValueOnce(undefined)
  await request(app).get("/nonexistent-id").expect(404)
})
