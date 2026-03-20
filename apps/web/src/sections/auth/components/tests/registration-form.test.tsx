import { render } from "vitest-browser-react"

import { ApiError } from "~/api/api-error"
import { RegistrationForm } from "~/sections/auth/components/registration-form"

test("submits valid registration", async () => {
  const onSubmit = vi.fn()
  const screen = await render(<RegistrationForm onSubmit={onSubmit} />)

  await screen.getByLabelText(/first name/i).fill("John")
  await screen.getByLabelText(/last name/i).fill("Doe")
  await screen.getByLabelText(/username/i).fill("johndoe")
  await screen.getByLabelText(/email address/i).fill("john@example.com")
  await screen.getByLabelText(/^password$/i).fill("Password123!")
  await screen.getByLabelText(/confirm password/i).fill("Password123!")
  await screen.getByRole("button", { name: /create account/i }).click()

  expect(onSubmit).toHaveBeenCalledWith({
    firstName: "John",
    lastName: "Doe",
    username: "johndoe",
    email: "john@example.com",
    password: "Password123!",
  })
})

test("does not submit on missing fields", async () => {
  const onSubmit = vi.fn()
  const screen = await render(<RegistrationForm onSubmit={onSubmit} />)

  const button = screen.getByRole("button", { name: /create account/i })
  await button.click()

  await expect.element(screen.getByLabelText(/first name/i)).toBeInvalid()
  await expect.element(screen.getByLabelText(/last name/i)).toBeInvalid()
  await expect.element(screen.getByLabelText(/username/i)).toBeInvalid()
  await expect.element(screen.getByLabelText(/email address/i)).toBeInvalid()
  await expect.element(screen.getByLabelText(/^password$/i)).toBeInvalid()
  await expect.element(screen.getByLabelText(/confirm password/i)).toBeInvalid()

  expect(onSubmit).not.toHaveBeenCalled()
})

test("fails on invalid email", async () => {
  const screen = await render(<RegistrationForm onSubmit={vi.fn()} />)

  const emailInput = screen.getByLabelText(/email address/i)
  const button = screen.getByRole("button", { name: /create account/i })

  await emailInput.fill("invalidemail")
  await button.click()

  await expect.element(emailInput).toBeInvalid()
})

test("fails on password mismatch", async () => {
  const screen = await render(<RegistrationForm onSubmit={vi.fn()} />)

  const passwordInput = screen.getByLabelText(/^password$/i)
  const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
  const button = screen.getByRole("button", { name: /create account/i })

  await passwordInput.fill("Password123!")
  await confirmPasswordInput.fill("DifferentPassword123!")
  await button.click()

  await expect.element(confirmPasswordInput).toBeInvalid()
})

test("shows root level API error messages", async () => {
  const screen = await render(
    <RegistrationForm
      onSubmit={() => {
        throw new ApiError("TOO_MANY_REQUESTS")
      }}
    />
  )

  await screen.getByLabelText(/first name/i).fill("John")
  await screen.getByLabelText(/last name/i).fill("Doe")
  await screen.getByLabelText(/username/i).fill("johndoe")
  await screen.getByLabelText(/email address/i).fill("john@example.com")
  await screen.getByLabelText(/^password$/i).fill("Password123!")
  await screen.getByLabelText(/confirm password/i).fill("Password123!")
  await screen.getByRole("button", { name: /create account/i }).click()

  await expect.element(screen.getByText(/too many attempts/i)).toBeVisible()
})

test("shows specific API error messages", async () => {
  const onSubmit = vi.fn(async () => {
    throw new ApiError("VALIDATION_ERROR", {
      username: "Username is already taken",
      email: "Email is already in use",
    })
  })

  const screen = await render(<RegistrationForm onSubmit={onSubmit} />)

  await screen.getByLabelText(/first name/i).fill("John")
  await screen.getByLabelText(/last name/i).fill("Doe")
  await screen.getByLabelText(/username/i).fill("johndoe")
  await screen.getByLabelText(/email address/i).fill("john@example.com")
  await screen.getByLabelText(/^password$/i).fill("Password123!")
  await screen.getByLabelText(/confirm password/i).fill("Password123!")
  await screen.getByRole("button", { name: /create account/i }).click()

  await expect.element(screen.getByText(/username is already taken/i)).toBeVisible()
  await expect.element(screen.getByText(/email is already in use/i)).toBeVisible()
})

describe("Password validation", () => {
  it.each([
    {
      description: "fails on password shorter than 8 characters",
      password: "P1!",
    },
    {
      description: "fails on password without uppercase letter",
      password: "password123!",
    },
    {
      description: "fails on password without lowercase letter",
      password: "PASSWORD123!",
    },
    {
      description: "fails on password without number",
      password: "Password!",
    },
    {
      description: "fails on password without special character",
      password: "Password123",
    },
  ])("$description", async ({ password }) => {
    const screen = await render(<RegistrationForm onSubmit={vi.fn()} />)

    const passwordInput = screen.getByLabelText(/^password$/i)
    const button = screen.getByRole("button", { name: /create account/i })

    await passwordInput.fill(password)
    await button.click()

    await expect.element(passwordInput).toBeInvalid()
  })
})
