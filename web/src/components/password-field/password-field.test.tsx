import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { PasswordField } from "./index"

it("renders a password field", () => {
  render(<PasswordField onChange={() => {}} />)

  const input = screen.getByLabelText("Password")

  expect(input).toBeVisible()
  expect(input).toHaveAttribute("type", "password")
})

it("toggles password visibility", async () => {
  const user = userEvent.setup()
  render(<PasswordField onChange={() => {}} />)

  const input = screen.getByLabelText("Password")
  const toggleButton = screen.getByRole("button", {
    name: /Show password/,
  })

  expect(input).toHaveAttribute("type", "password")

  await user.click(toggleButton)
  expect(input).toHaveAttribute("type", "text")

  await user.click(toggleButton)
  expect(input).toHaveAttribute("type", "password")
})

it("password must have one uppercase letter", async () => {
  const input = await writeAndTab("password1")
  expect(input).toBeInvalid()
})

it("password must have one number", async () => {
  const input = await writeAndTab("Password")
  expect(input).toBeInvalid()
})

it("password must have one special character", async () => {
  const input = await writeAndTab("Password1")
  expect(input).toBeInvalid()
})

it("password must have at least 8 characters", async () => {
  const input = await writeAndTab("P1!")
  expect(input).toBeInvalid()
})

async function writeAndTab(password: string) {
  const user = userEvent.setup()
  render(<PasswordField onChange={() => {}} />)

  const input = screen.getByLabelText("Password")

  await user.type(input, password)
  await user.tab()

  return input
}
