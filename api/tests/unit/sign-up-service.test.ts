import { BcryptHasher } from "../../src/modules/auth/implementations/bcrypt-hasher.ts"
import { SignUpService } from "../../src/modules/auth/services/sign-up-service.ts"
import { InMemoryUserRepository } from "../mocks/in-memory-user-repository.ts"

const it = test.extend("repo", new InMemoryUserRepository()).extend("service", ({ repo }) => {
  return new SignUpService(repo, new BcryptHasher(1))
})

describe("SignUpService", () => {
  it("returns a public user", async ({ service }) => {
    const result = await service.execute({
      username: "testuser",
      password: "password123",
      firstName: "Test",
      lastName: "User",
    })

    expect(result).toEqual({
      id: expect.any(String),
      username: "testuser",
      firstName: "Test",
      lastName: "User",
      bio: null,
      profilePictureUrl: null,
    })
  })

  it("returns null if username is already taken", async ({ service, repo }) => {
    await repo.create({
      username: "testuser",
      hashedPassword: "hashedpassword",
      firstName: "Existing",
      lastName: "User",
    })

    const result = await service.execute({
      username: "testuser",
      password: "password123",
      firstName: "Test",
      lastName: "User",
    })

    expect(result).toBeNull()
  })
})
