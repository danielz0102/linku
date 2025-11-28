import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import FormField from "./index"

const FF = FormField

describe("FormField.Input", () => {
  it("renders a text input by default and accepts typing", async () => {
    const user = userEvent.setup()
    render(<FF.Input placeholder="Your name" />)

    const input = screen.getByPlaceholderText("Your name")

    expect(input).toHaveAttribute("type", "text")

    await user.type(input, "Ada")

    expect(input).toHaveValue("Ada")
  })

  it("passes through standard input attributes", () => {
    render(<FF.Input placeholder="Email" name="email" disabled />)

    const input = screen.getByPlaceholderText("Email")

    expect(input).toHaveAttribute("name", "email")
    expect(input).toBeDisabled()
  })

  it("does not render visibility toggle for non-password types", () => {
    render(<FF.Input type="email" placeholder="Email" />)
    expect(
      screen.queryByRole("button", { name: /show password|hide password/i })
    ).not.toBeInTheDocument()
  })

  it("renders password field with visibility toggle", async () => {
    const user = userEvent.setup()
    render(<FF.Input type="password" placeholder="Password" />)

    const input = screen.getByPlaceholderText("Password")

    expect(input).toHaveAttribute("type", "password")

    const toggle = screen.getByRole("button", { name: /show password/i })
    await user.click(toggle)

    expect(input).toHaveAttribute("type", "text")
    expect(toggle).toHaveAccessibleName("Hide password")
  })

  it("hides visibility toggle when hideVisibilityToggle is true", () => {
    render(
      <FF.Input type="password" placeholder="Password" hideVisibilityToggle />
    )

    expect(
      screen.queryByRole("button", { name: /show password|hide password/i })
    ).not.toBeInTheDocument()
  })

  it("toggle button has aria-live=polite and supports keyboard activation", async () => {
    const user = userEvent.setup()
    render(<FF.Input type="password" placeholder="Password" />)

    await user.tab()
    await user.tab()

    const toggle = screen.getByRole("button", { name: /show password/i })
    expect(toggle).toHaveAttribute("aria-live", "polite")

    await user.keyboard("{Enter}")
    expect(toggle).toHaveAccessibleName("Hide password")

    await user.keyboard(" ") // Space
    expect(toggle).toHaveAccessibleName("Show password")
  })
})

describe("FormField.Link", () => {
  it("renders an accessible link with href and rel when provided", () => {
    render(
      <FF.Link href="/forgot" rel="noopener noreferrer">
        Forgot?
      </FF.Link>
    )
    const link = screen.getByRole("link", { name: "Forgot?" })
    expect(link).toHaveAttribute("href", "/forgot")
    expect(link).toHaveAttribute("rel", "noopener noreferrer")
  })
})

describe("FormField.Input validation", () => {
  it("displays validation message from the Validation API when invalid", async () => {
    const user = userEvent.setup()
    render(
      <form>
        <FF.Input placeholder="Email" required />
        <button type="submit">Submit</button>
      </form>
    )

    const input = screen.getByPlaceholderText<HTMLInputElement>("Email")
    input.setCustomValidity("Please fill out this field")

    await user.click(screen.getByRole("button", { name: "Submit" }))

    const errorMessage = screen.getByText("Please fill out this field")
    expect(errorMessage).toBeVisible()
  })

  it("clears error message when input becomes valid", async () => {
    const user = userEvent.setup()
    render(
      <form>
        <FF.Input placeholder="Email" required />
        <button type="submit">Submit</button>
      </form>
    )

    const input = screen.getByPlaceholderText<HTMLInputElement>("Email")
    input.setCustomValidity("Please fill out this field")

    await user.click(screen.getByRole("button", { name: "Submit" }))

    const errorContainer = screen.getByText("Please fill out this field")
    expect(errorContainer).toBeVisible()

    input.setCustomValidity("")
    await user.type(input, "test@example.com")

    expect(errorContainer).toBeEmptyDOMElement()
  })

  it("error message container has aria-live=polite for accessibility", () => {
    render(<FF.Input placeholder="Email" required />)

    const errorContainer = document.querySelector("[aria-live='polite']")
    expect(errorContainer).toHaveAttribute("aria-atomic", "true")
  })
})
