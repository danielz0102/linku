import { render, screen } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { MemoryRouter, Route, Routes } from "react-router"
import PublicProfile from "~/users/public-profile"
import * as getUserByIdModule from "~/users/services/get-user-by-id"
import { ApiError } from "~/shared/api/api-error"
import type { LinkuAPI } from "@linku/api-contract"

vi.mock("~/users/services/get-user-by-id")
const getUserByIdSpy = vi.mocked(getUserByIdModule.getUserById)

function setup(userId = "user-123") {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/users/${userId}`]}>
        <Routes>
          <Route path="/users/:id" element={<PublicProfile />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  )
}

function buildUser(overrides: Partial<LinkuAPI.User> = {}): LinkuAPI.User {
  return {
    id: "user-123",
    username: "johndoe",
    email: "john@example.com",
    firstName: "John",
    lastName: "Doe",
    profilePicUrl: null,
    bio: null,
    ...overrides,
  }
}

test("shows loading spinner while fetching", () => {
  getUserByIdSpy.mockReturnValue(new Promise(() => {}))
  setup()
  expect(screen.getByRole("status", { name: /loading/i })).toBeVisible()
})

test("renders user full name and username when loaded", async () => {
  getUserByIdSpy.mockResolvedValue(
    buildUser({ firstName: "John", lastName: "Doe", username: "johndoe" })
  )
  setup()

  expect(await screen.findByRole("heading", { name: "John Doe" })).toBeVisible()
  expect(await screen.findByText("@johndoe")).toBeVisible()
})

test("renders user bio when present", async () => {
  getUserByIdSpy.mockResolvedValue(buildUser({ bio: "Hello I am John" }))
  setup()

  expect(await screen.findByText("Hello I am John")).toBeVisible()
})

test("renders fallback when bio is absent", async () => {
  getUserByIdSpy.mockResolvedValue(buildUser({ bio: null }))
  setup()

  expect(await screen.findByText(/no bio available/i)).toBeVisible()
})

test("renders profile picture", async () => {
  getUserByIdSpy.mockResolvedValue(
    buildUser({ profilePicUrl: "https://example.com/avatar.jpg" })
  )
  setup()

  const img = await screen.findByRole("img", { name: /profile picture/i })
  expect(img).toHaveAttribute("src", "https://example.com/avatar.jpg")
})

test("shows 404 error page when user is not found", async () => {
  getUserByIdSpy.mockRejectedValue(new ApiError({ code: "NOT_FOUND" }))
  setup()

  expect(await screen.findByText("404")).toBeVisible()
  expect(await screen.findByText(/user not found/i)).toBeVisible()
})

test("shows 500 error page on unexpected errors", async () => {
  getUserByIdSpy.mockRejectedValue(new ApiError({ code: "UNEXPECTED_ERROR" }))
  setup()

  expect(await screen.findByText("500")).toBeVisible()
  expect(await screen.findByText(/something went wrong/i)).toBeVisible()
})

test("does not show edit controls", async () => {
  getUserByIdSpy.mockResolvedValue(buildUser())
  setup()

  await screen.findByRole("heading", { name: "John Doe" })

  expect(
    screen.queryByRole("link", { name: /update profile/i })
  ).not.toBeInTheDocument()
  expect(
    screen.queryByRole("button", { name: /edit profile picture/i })
  ).not.toBeInTheDocument()
})
