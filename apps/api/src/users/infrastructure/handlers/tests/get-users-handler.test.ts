import request from "supertest"
import { AppBuilder } from "~/__test-utils__/builders/app-builder.ts"
import { UserRepositoryMock } from "~/__test-utils__/mocks/user-repository-mock.ts"
import { UserMother } from "~/__test-utils__/mothers/user-mother.ts"
import { getUsersHandler } from "../get-users-handler.ts"

const repository = new UserRepositoryMock()

const app = new AppBuilder().withSession().build()
app.get("/", getUsersHandler(repository))

test("sends 200 with a list of users", async () => {
  const users = [UserMother.create(), UserMother.create()]
  repository.search.mockResolvedValueOnce(users)

  const expected = users.map((user) => ({
    id: user.id,
    username: user.username,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    bio: user.bio,
    profilePicUrl: user.profilePicUrl,
  }))

  await request(app)
    .get("/")
    .query({ username: "test" })
    .expect(200)
    .expect(expected)
})

test("sends 200 with an empty list when no users match", async () => {
  repository.search.mockResolvedValueOnce([])

  await request(app)
    .get("/")
    .query({ firstName: "nonexistent" })
    .expect(200)
    .expect([])
})

test("sends 200 with pagination options", async () => {
  const users = [UserMother.create()]
  repository.search.mockResolvedValueOnce(users)

  await request(app)
    .get("/")
    .query({ username: "test", limit: "10", offset: "0" })
    .expect(200)
})
