import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { MemoryRouter } from "react-router"
import SearchUsers from "~/users/search-users"
import * as searchUsersModule from "~/users/services/search-users"
import { ApiError } from "~/shared/api/api-error"
import type { LinkuAPI } from "@linku/api-contract"

vi.mock("~/users/services/search-users")
const searchUsersSpy = vi.mocked(searchUsersModule.searchUsers)

function setup() {
  const user = userEvent.setup()
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <SearchUsers />
      </MemoryRouter>
    </QueryClientProvider>
  )
  return user
}

function buildUser(overrides: Partial<LinkuAPI.User> = {}): LinkuAPI.User {
  return {
    id: "user-1",
    username: "johndoe",
    email: "john@example.com",
    firstName: "John",
    lastName: "Doe",
    profilePicUrl: null,
    bio: null,
    ...overrides,
  }
}

test("renders search input", () => {
  setup()
  expect(screen.getByRole("searchbox", { name: /search users/i })).toBeVisible()
})

test("does not show results menu when input is empty", () => {
  setup()
  expect(screen.queryByRole("listbox")).not.toBeInTheDocument()
})

test("shows results after user finishes typing", async () => {
  const user = setup()
  searchUsersSpy.mockResolvedValue([
    buildUser({
      id: "1",
      username: "johndoe",
      firstName: "John",
      lastName: "Doe",
    }),
    buildUser({
      id: "2",
      username: "janedoe",
      firstName: "Jane",
      lastName: "Doe",
    }),
  ])

  await user.type(screen.getByRole("searchbox"), "doe")

  expect(await screen.findByRole("listbox")).toBeVisible()
  expect(await screen.findByText("John Doe")).toBeVisible()
  expect(await screen.findByText("@johndoe")).toBeVisible()
  expect(await screen.findByText("Jane Doe")).toBeVisible()
  expect(await screen.findByText("@janedoe")).toBeVisible()
})

test("each result item links to the user public profile page", async () => {
  const user = setup()
  searchUsersSpy.mockResolvedValue([
    buildUser({ id: "user-123", username: "johndoe" }),
  ])

  await user.type(screen.getByRole("searchbox"), "john")

  const link = await screen.findByRole("link", { name: /john doe/i })
  expect(link).toHaveAttribute("href", "/users/user-123")
})

test("shows empty state when no users match", async () => {
  const user = setup()
  searchUsersSpy.mockResolvedValue([])

  await user.type(screen.getByRole("searchbox"), "nobody")

  expect(await screen.findByText(/no users found/i)).toBeVisible()
})

test("shows error message when search fails", async () => {
  const user = setup()
  searchUsersSpy.mockRejectedValue(new ApiError({ code: "UNEXPECTED_ERROR" }))

  await user.type(screen.getByRole("searchbox"), "error")

  expect(await screen.findByRole("alert")).toBeVisible()
})

test("shows profile picture for each result", async () => {
  const user = setup()
  searchUsersSpy.mockResolvedValue([
    buildUser({ id: "1", profilePicUrl: "https://example.com/pic.jpg" }),
  ])

  await user.type(screen.getByRole("searchbox"), "john")

  const img = await screen.findByRole("img", { name: "johndoe" })
  expect(img).toHaveAttribute("src", "https://example.com/pic.jpg")
})

test("hides results when input is cleared", async () => {
  const user = setup()
  searchUsersSpy.mockResolvedValue([buildUser()])

  const input = screen.getByRole("searchbox")
  await user.type(input, "john")
  await screen.findByRole("listbox")

  await user.clear(input)

  await waitFor(() =>
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument()
  )
})
