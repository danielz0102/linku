import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import Home from "../pages/home"
import { AuthContext } from "~/users/context/auth-context"
import { Renderer } from "~/__tests__/utils/renderer"

test("shows feedback when logout fails", async () => {
  const user = userEvent.setup()
  const renderer = new Renderer()
  const error = new Error("logout failed")

  const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {})

  renderer.render(
    <AuthContext
      value={{
        user: null,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn().mockRejectedValue(error),
      }}
    >
      <Home />
    </AuthContext>
  )

  await user.click(screen.getByRole("button", { name: /log out/i }))

  expect(consoleErrorSpy).toHaveBeenCalledWith(error)
  expect(screen.getByText("Could not log out. Please try again.")).toBeVisible()
  consoleErrorSpy.mockRestore()
})
