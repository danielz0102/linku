import User from "./user"
import { Email } from "../value-objects/email"

const defaultUser = {
  id: "1",
  username: "johndoe",
  email: new Email("john.doe@example.com"),
  passwordHash: "hashedpassword",
  profilePicUrl: "http://example.com/profile.jpg",
}

test("creates a user instance", () => {
  const user = new User(defaultUser)
  expect(user).toBeInstanceOf(User)
  expect(user).toMatchObject(defaultUser)
})

test('set status to "offline" if not provided', () => {
  const user = new User(defaultUser)
  expect(user.status).toBe("offline")
})

test("allows profile picture URL to be optional", () => {
  const user = new User({ ...defaultUser, profilePicUrl: undefined })
  expect(user.profilePicUrl).toBeUndefined()
})

test("throws an error for invalid profile picture URL", () => {
  expect(() => {
    new User({ ...defaultUser, profilePicUrl: "invalid-url" })
  }).toThrow("Invalid profile picture URL")
})
