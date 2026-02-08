import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { renderWithQueryClient } from "~/__tests__/utils/render-with-client"
import { RegistrationForm } from "~/users/components/registration-form"
import { register } from "../services/register"

vi.mock(import("~/users/services/register"), () => ({
  register: vi.fn(),
}))

const service = vi.mocked(register)

test("has all form fields", () => {
  renderWithQueryClient(<RegistrationForm />)

  expect(screen.getByLabelText(/first name/i)).toBeVisible()
  expect(screen.getByLabelText(/last name/i)).toBeVisible()
  expect(screen.getByLabelText(/username/i)).toBeVisible()
  expect(screen.getByLabelText(/email address/i)).toBeVisible()
  expect(screen.getByLabelText(/^password$/i)).toBeVisible()
  expect(screen.getByLabelText(/confirm password/i)).toBeVisible()
  expect(screen.getByRole("button", { name: /create account/i })).toBeVisible()
})

test("fails on missing fields", async () => {
  const user = userEvent.setup()
  renderWithQueryClient(<RegistrationForm />)

  const button = screen.getByRole("button", { name: /create account/i })
  await user.click(button)
  const fields = screen.getAllByRole("textbox")

  fields.forEach((field) => {
    expect(field).toBeInvalid()
  })

  expect(service).not.toHaveBeenCalled()
})

test("fails on invalid email", async () => {
  const user = userEvent.setup()
  renderWithQueryClient(<RegistrationForm />)

  const emailInput = screen.getByLabelText(/email address/i)
  const button = screen.getByRole("button", { name: /create account/i })

  await user.type(emailInput, "invalidemail")
  await user.click(button)

  expect(emailInput).toBeInvalid()
})

test("fails on password mismatch", async () => {
  const user = userEvent.setup()
  renderWithQueryClient(<RegistrationForm />)

  const passwordInput = screen.getByLabelText(/^password$/i)
  const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
  const button = screen.getByRole("button", { name: /create account/i })

  await user.type(passwordInput, "Password123!")
  await user.type(confirmPasswordInput, "DifferentPassword123!")
  await user.click(button)

  expect(confirmPasswordInput).toBeInvalid()
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
  renderWithQueryClient(<RegistrationForm />)

  const passwordInput = screen.getByLabelText(/^password$/i)
  const button = screen.getByRole("button", { name: /create account/i })

  await user.type(passwordInput, password)
  await user.click(button)

  expect(passwordInput).toBeInvalid()
}
