import request from "supertest"
import { AppBuilder } from "~/__test-utils__/builders/app-builder.ts"
import { UserRepositoryMock } from "~/__test-utils__/mocks/user-repository-mock.ts"
import { UserMother } from "~/__test-utils__/mothers/user-mother.ts"
import { getUserByIdHandler } from "../get-user-by-id-handler.ts"

const repository = new UserRepositoryMock()

const app = new AppBuilder().withSession().build()
app.get("/:id", getUserByIdHandler(repository))

test("sends 200 with user data", async () => {
  const user = UserMother.create()
  repository.findOne.mockResolvedValueOnce(user)

  const expected = {
    id: user.id,
    username: user.username,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    bio: user.bio,
    profilePicUrl: user.profilePicUrl,
  }

  await request(app).get(`/${user.id}`).expect(200).expect(expected)
})

test("sends 404 if user is not found", async () => {
  repository.findOne.mockResolvedValueOnce(undefined)

  await request(app).get("/nonexistent-id").expect(404)
})
