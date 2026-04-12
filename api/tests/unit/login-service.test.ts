import { TRPCError } from "@trpc/server"
import { beforeEach, describe, expect, it, vi } from "vitest"

const dbSelectMock = vi.fn<
  () => {
    from: () => {
      where: () => {
        limit: () => Promise<Array<{ id: string; hashedPassword: string }>>
      }
    }
  }
>()
const bcryptCompareMock = vi.fn<(password: string, hash: string) => Promise<boolean>>()
const mockedRows: Array<{ id: string; hashedPassword: string }> = []

vi.mock("#db/drizzle/drizzle-client.ts", () => ({
  db: {
    select: dbSelectMock,
  },
}))

vi.mock("bcryptjs", () => ({
  default: {
    compare: bcryptCompareMock,
  },
}))

describe("Login Service", () => {
  beforeEach(() => {
    dbSelectMock.mockReset()
    bcryptCompareMock.mockReset()
    mockedRows.length = 0

    dbSelectMock.mockImplementation(() => ({
      from: () => ({
        where: () => ({
          limit: () => Promise.resolve(mockedRows),
        }),
      }),
    }))
  })

  it("throws UNAUTHORIZED when username does not exist", async () => {
    const { login } = await import("~/modules/users/commands/login/login-service.ts")

    await expect(
      login(
        {
          username: "missing-user",
          password: "password",
        },
        {}
      )
    ).rejects.toEqual(new TRPCError({ code: "UNAUTHORIZED", message: "Invalid credentials" }))
  })

  it("throws UNAUTHORIZED when password is invalid", async () => {
    mockedRows.push({ id: "user-id", hashedPassword: "hashed-password" })
    bcryptCompareMock.mockResolvedValue(false)
    const { login } = await import("~/modules/users/commands/login/login-service.ts")

    await expect(
      login(
        {
          username: "john",
          password: "wrong-password",
        },
        {}
      )
    ).rejects.toEqual(new TRPCError({ code: "UNAUTHORIZED", message: "Invalid credentials" }))
  })

  it("creates the session when credentials are valid", async () => {
    mockedRows.push({ id: "user-id", hashedPassword: "hashed-password" })
    bcryptCompareMock.mockResolvedValue(true)
    const { login } = await import("~/modules/users/commands/login/login-service.ts")
    const session: { userId?: string } = {}

    await expect(
      login(
        {
          username: "john",
          password: "valid-password",
        },
        session
      )
    ).resolves.toBeUndefined()

    expect(session.userId).toBe("user-id")
  })
})
