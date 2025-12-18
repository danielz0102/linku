import User from "./user"

describe("User", () => {
  const defaultUser = {
    id: "1",
    username: "johndoe",
    email: "john.doe@example.com",
    passwordHash: "hashedpassword",
    profilePicUrl: "http://example.com/profile.jpg",
  }

  it("should create a user instance", () => {
    const user = new User(defaultUser)
    expect(user).toBeInstanceOf(User)
    expect(user).toMatchObject(defaultUser)
  })

  it("should throw an error for invalid email", () => {
    expect(() => {
      new User({ ...defaultUser, email: "invalid-email" })
    }).toThrow("Invalid email format")
  })

  it("should throw an error for invalid profile picture URL", () => {
    expect(() => {
      new User({ ...defaultUser, profilePicUrl: "invalid-url" })
    }).toThrow("Invalid profile picture URL")
  })
})
