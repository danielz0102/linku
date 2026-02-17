import { render, screen } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router"
import { ProtectedRoute } from "../components/protected-route"
import { AuthContext } from "~/users/context/auth-context"

const user = {
  id: "1",
  username: "johndoe",
  email: "john@example.com",
  firstName: "John",
  lastName: "Doe",
  bio: null,
  profilePicUrl: null,
}

test("redirects to login when user is not logged in", () => {
  renderWithUser(null)

  expect(screen.getByText("Login page")).toBeVisible()
  expect(screen.queryByText("Home page")).not.toBeInTheDocument()
})

test("renders protected content when user is logged in", () => {
  renderWithUser(user)

  expect(screen.getByText("Home page")).toBeVisible()
  expect(screen.queryByText("Login page")).not.toBeInTheDocument()
})

function renderWithUser(currentUser: typeof user | null) {
  return render(
    <AuthContext
      value={{
        user: currentUser,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
      }}
    >
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <div>Home page</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>Login page</div>} />
        </Routes>
      </MemoryRouter>
    </AuthContext>
  )
}
