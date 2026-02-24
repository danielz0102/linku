import request from "supertest"
import { AppBuilder } from "~/__test-utils__/builders/app-builder.ts"
import { clearUsers, createTestUser, TEST_PASSWORD } from "~/__test-utils__/db/db-utils.ts"
import { loginEndpoint } from "~/users/infrastructure/endpoints/login-endpoint.ts"

const app = new AppBuilder().withSession().build()
app.post("/", loginEndpoint)

afterEach(async () => {
  await clearUsers()
})

test("sends 200 with user data when credentials are valid", async () => {
  const user = await createTestUser()

  await request(app)
    .post("/")
    .send({ username: user.username, password: TEST_PASSWORD })
    .expect(200)
    .expect((res) => {
      expect(res.body.id).toBe(user.id)
    })
})

test("sends 401 when credentials are invalid", async () => {
  const user = await createTestUser()

  await request(app)
    .post("/")
    .send({ username: user.username, password: "wrongpassword" })
    .expect(401)
    .expect((res) => {
      expect(res.body.code).toBe("UNAUTHORIZED")
    })
})

test("sends 400 when username is empty", async () => {
  await request(app)
    .post("/")
    .send({ username: "", password: TEST_PASSWORD })
    .expect(400)
    .expect((res) => {
      expect(res.body.code).toBe("VALIDATION_ERROR")
    })
})

test("sends 400 when password is empty", async () => {
  await request(app)
    .post("/")
    .send({ username: "testuser", password: "" })
    .expect(400)
    .expect((res) => {
      expect(res.body.code).toBe("VALIDATION_ERROR")
    })
})
