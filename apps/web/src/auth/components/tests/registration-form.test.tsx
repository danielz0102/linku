import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { RegistrationForm } from "~/auth/components/registration-form"
import { ApiError } from "~/shared/api/api-error"

test("submits valid registration", async () => {
  const user = userEvent.setup()
  const onSubmit = vi.fn()
  render(<RegistrationForm onSubmit={onSubmit} />)

  await user.type(screen.getByLabelText(/first name/i), "John")
  await user.type(screen.getByLabelText(/last name/i), "Doe")
  await user.type(screen.getByLabelText(/username/i), "johndoe")
  await user.type(screen.getByLabelText(/email address/i), "john@example.com")
  await user.type(screen.getByLabelText(/^password$/i), "Password123!")
  await user.type(screen.getByLabelText(/confirm password/i), "Password123!")
  await user.click(screen.getByRole("button", { name: /create account/i }))

  expect(onSubmit).toHaveBeenCalledWith({
    firstName: "John",
    lastName: "Doe",
    username: "johndoe",
    email: "john@example.com",
    password: "Password123!",
  })
})

test("does not submit on missing fields", async () => {
  const user = userEvent.setup()
  const onSubmit = vi.fn()
  render(<RegistrationForm onSubmit={onSubmit} />)

  const button = screen.getByRole("button", { name: /create account/i })
  await user.click(button)

  expect(screen.getByLabelText(/first name/i)).toBeInvalid()
  expect(screen.getByLabelText(/last name/i)).toBeInvalid()
  expect(screen.getByLabelText(/username/i)).toBeInvalid()
  expect(screen.getByLabelText(/email address/i)).toBeInvalid()
  expect(screen.getByLabelText(/^password$/i)).toBeInvalid()
  expect(screen.getByLabelText(/confirm password/i)).toBeInvalid()

  expect(onSubmit).not.toHaveBeenCalled()
})

test("fails on invalid email", async () => {
  const user = userEvent.setup()
  render(<RegistrationForm onSubmit={vi.fn()} />)

  const emailInput = screen.getByLabelText(/email address/i)
  const button = screen.getByRole("button", { name: /create account/i })

  await user.type(emailInput, "invalidemail")
  await user.click(button)

  expect(emailInput).toBeInvalid()
})

test("fails on password mismatch", async () => {
  const user = userEvent.setup()
  render(<RegistrationForm onSubmit={vi.fn()} />)

  const passwordInput = screen.getByLabelText(/^password$/i)
  const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
  const button = screen.getByRole("button", { name: /create account/i })

  await user.type(passwordInput, "Password123!")
  await user.type(confirmPasswordInput, "DifferentPassword123!")
  await user.click(button)

  expect(confirmPasswordInput).toBeInvalid()
})

test("shows root level API error messages", async () => {
  const user = userEvent.setup()
  render(
    <RegistrationForm
      onSubmit={() => {
        throw new ApiError("TOO_MANY_REQUESTS")
      }}
    />
  )

  await user.type(screen.getByLabelText(/first name/i), "John")
  await user.type(screen.getByLabelText(/last name/i), "Doe")
  await user.type(screen.getByLabelText(/username/i), "johndoe")
  await user.type(screen.getByLabelText(/email address/i), "john@example.com")
  await user.type(screen.getByLabelText(/^password$/i), "Password123!")
  await user.type(screen.getByLabelText(/confirm password/i), "Password123!")
  await user.click(screen.getByRole("button", { name: /create account/i }))

  expect(await screen.findByText(/too many attempts/i)).toBeVisible()
})

test("shows specific API error messages", async () => {
  const user = userEvent.setup()
  const onSubmit = vi.fn(async () => {
    throw new ApiError("VALIDATION_ERROR", {
      username: "Username is already taken",
      email: "Email is already in use",
    })
  })

  render(<RegistrationForm onSubmit={onSubmit} />)

  await user.type(screen.getByLabelText(/first name/i), "John")
  await user.type(screen.getByLabelText(/last name/i), "Doe")
  await user.type(screen.getByLabelText(/username/i), "johndoe")
  await user.type(screen.getByLabelText(/email address/i), "john@example.com")
  await user.type(screen.getByLabelText(/^password$/i), "Password123!")
  await user.type(screen.getByLabelText(/confirm password/i), "Password123!")
  await user.click(screen.getByRole("button", { name: /create account/i }))

  expect(await screen.findByText(/username is already taken/i)).toBeVisible()
  expect(await screen.findByText(/email is already in use/i)).toBeVisible()
})

describe("Password validation", () => {
  it("fails on password shorter than 8 characters", async () => {
    testPassword("P1!")
  })

  it("fails on password without uppercase letter", async () => {
    testPassword("password123!")
  })

  it("fails on password without lowercase letter", async () => {
    testPassword("PASSWORD123!")
  })

  it("fails on password without number", async () => {
    testPassword("Password!")
  })

  it("fails on password without special character", async () => {
    testPassword("Password123")
  })
})

async function testPassword(password: string) {
  const user = userEvent.setup()
  render(<RegistrationForm onSubmit={vi.fn()} />)

  const passwordInput = screen.getByLabelText(/^password$/i)
  const button = screen.getByRole("button", { name: /create account/i })

  await user.type(passwordInput, password)
  await user.click(button)

  expect(passwordInput).toBeInvalid()
}
