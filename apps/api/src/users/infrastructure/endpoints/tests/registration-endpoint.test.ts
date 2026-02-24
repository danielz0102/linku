import type { RegistrationBody } from "@linku/api-contract"
import request from "supertest"
import { AppBuilder } from "~/__test-utils__/builders/app-builder.ts"
import { clearUsers, createTestUser } from "~/__test-utils__/db/db-utils.ts"
import { registerUserEndpoint } from "~/users/infrastructure/endpoints/register-user-endpoint.ts"

const app = new AppBuilder().withSession().build()
app.post("/", registerUserEndpoint)

const validBody: RegistrationBody = {
  username: "testuser",
  email: "test@example.com",
  password: "Password1!",
  firstName: "Test",
  lastName: "User",
}

afterEach(async () => {
  await clearUsers()
})

test("sends 200 with user data when registration succeeds", async () => {
  await request(app)
    .post("/")
    .send(validBody)
    .expect(200)
    .expect((res) => {
      expect(res.body.username).toBe(validBody.username)
    })
})

test("sends 409 if username exists", async () => {
  await createTestUser({ username: validBody.username })

  await request(app)
    .post("/")
    .send(validBody)
    .expect(409)
    .expect((res) => {
      expect(res.body.code).toBe("VALIDATION_ERROR")
    })
})

test("sends 409 if email exists", async () => {
  await createTestUser({ email: validBody.email })

  await request(app)
    .post("/")
    .send(validBody)
    .expect(409)
    .expect((res) => {
      expect(res.body.code).toBe("VALIDATION_ERROR")
    })
})

test("sends 400 when password is too short", async () => {
  await request(app)
    .post("/")
    .send({ ...validBody, password: "Pass1!" })
    .expect(400)
    .expect((res) => {
      expect(res.body.code).toBe("VALIDATION_ERROR")
    })
})

test("sends 400 when password has no uppercase letter", async () => {
  await request(app)
    .post("/")
    .send({ ...validBody, password: "password1!" })
    .expect(400)
    .expect((res) => {
      expect(res.body.code).toBe("VALIDATION_ERROR")
    })
})

test("sends 400 when password has no lowercase letter", async () => {
  await request(app)
    .post("/")
    .send({ ...validBody, password: "PASSWORD1!" })
    .expect(400)
    .expect((res) => {
      expect(res.body.code).toBe("VALIDATION_ERROR")
    })
})

test("sends 400 when password has no number", async () => {
  await request(app)
    .post("/")
    .send({ ...validBody, password: "Password!" })
    .expect(400)
    .expect((res) => {
      expect(res.body.code).toBe("VALIDATION_ERROR")
    })
})

test("sends 400 when password has no special character", async () => {
  await request(app)
    .post("/")
    .send({ ...validBody, password: "Password1" })
    .expect(400)
    .expect((res) => {
      expect(res.body.code).toBe("VALIDATION_ERROR")
    })
})
