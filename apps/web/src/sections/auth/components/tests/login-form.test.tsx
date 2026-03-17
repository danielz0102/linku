import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { ApiError } from "~/api/api-error"
import { LoginForm } from "~/sections/auth/components/login-form"

test("submits valid credentials", async () => {
  const user = userEvent.setup()
  const onSubmit = vi.fn()
  render(<LoginForm onSubmit={onSubmit} />)

  await user.type(screen.getByLabelText(/username/i), "johndoe")
  await user.type(screen.getByLabelText(/password/i), "Password123!")
  await user.click(screen.getByRole("button", { name: /log in/i }))

  expect(onSubmit).toHaveBeenCalledWith({
    username: "johndoe",
    password: "Password123!",
  })
})

test("does not submit on missing fields", async () => {
  const user = userEvent.setup()
  const onSubmit = vi.fn()
  render(<LoginForm onSubmit={onSubmit} />)

  await user.click(screen.getByRole("button", { name: /log in/i }))

  expect(screen.getByLabelText(/username/i)).toBeInvalid()
  expect(screen.getByLabelText(/password/i)).toBeInvalid()
  expect(onSubmit).not.toHaveBeenCalled()
})

test("shows unauthorized login error message", async () => {
  const user = userEvent.setup()

  render(
    <LoginForm
      onSubmit={() => {
        throw new ApiError("UNAUTHORIZED")
      }}
    />
  )

  await user.type(screen.getByLabelText(/username/i), "johndoe")
  await user.type(screen.getByLabelText(/password/i), "wrong-password")
  await user.click(screen.getByRole("button", { name: /log in/i }))

  expect(await screen.findByText(/invalid username or password/i)).toBeVisible()
})

test("shows root level API error messages", async () => {
  const user = userEvent.setup()
  render(
    <LoginForm
      onSubmit={() => {
        throw new ApiError("TOO_MANY_REQUESTS")
      }}
    />
  )

  await user.type(screen.getByLabelText(/username/i), "johndoe")
  await user.type(screen.getByLabelText(/password/i), "Password123!")
  await user.click(screen.getByRole("button", { name: /log in/i }))

  expect(await screen.findByText(/too many attempts/i)).toBeVisible()
})
