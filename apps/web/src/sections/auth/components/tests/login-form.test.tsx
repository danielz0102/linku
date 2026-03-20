import { render } from "vitest-browser-react"

import { ApiError } from "~/api/api-error"
import { LoginForm } from "~/sections/auth/components/login-form"

test("submits valid credentials", async () => {
  const onSubmit = vi.fn()
  const screen = await render(<LoginForm onSubmit={onSubmit} />)

  await screen.getByLabelText(/username/i).fill("johndoe")
  await screen.getByLabelText(/password/i).fill("Password123!")
  await screen.getByRole("button", { name: /log in/i }).click()

  expect(onSubmit).toHaveBeenCalledWith({
    username: "johndoe",
    password: "Password123!",
  })
})

test("does not submit on missing fields", async () => {
  const onSubmit = vi.fn()
  const screen = await render(<LoginForm onSubmit={onSubmit} />)

  const usernameInput = screen.getByLabelText(/username/i)
  const passwordInput = screen.getByLabelText(/password/i)

  await screen.getByRole("button", { name: /log in/i }).click()

  await expect.element(usernameInput).toBeInvalid()
  await expect.element(passwordInput).toBeInvalid()
  expect(onSubmit).not.toHaveBeenCalled()
})

test("shows unauthorized login error message", async () => {
  const screen = await render(
    <LoginForm
      onSubmit={() => {
        throw new ApiError("UNAUTHORIZED")
      }}
    />
  )

  await screen.getByLabelText(/username/i).fill("johndoe")
  await screen.getByLabelText(/password/i).fill("wrong-password")
  await screen.getByRole("button", { name: /log in/i }).click()

  await expect.element(screen.getByText(/invalid username or password/i)).toBeVisible()
})

test("shows root level API error messages", async () => {
  const screen = await render(
    <LoginForm
      onSubmit={() => {
        throw new ApiError("TOO_MANY_REQUESTS")
      }}
    />
  )

  await screen.getByLabelText(/username/i).fill("johndoe")
  await screen.getByLabelText(/password/i).fill("Password123!")
  await screen.getByRole("button", { name: /log in/i }).click()

  await expect.element(screen.getByText(/too many attempts/i)).toBeVisible()
})
