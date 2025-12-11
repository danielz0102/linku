import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, within } from "storybook/test"
import Login from "./index"

const meta = {
  component: Login,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Login>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default login view with Login tab active
 */
export const LoginTab: Story = {
  play: async ({ canvas }) => {
    const loginForm = canvas.getByRole("form")
    const emailInput = within(loginForm).getByLabelText("Email / Username")
    const passwordInput = within(loginForm).getByLabelText("Password")

    await expect(emailInput).toBeVisible()
    await expect(passwordInput).toBeVisible()
  },
}

/**
 * Sign up view with Sign Up tab active
 */
export const SignUpTab: Story = {
  play: async ({ canvas, userEvent }) => {
    const toggle = canvas.getByRole("switch", {
      name: "Switch between Login and Sign Up",
    })
    await userEvent.click(toggle)

    const signUpForm = canvas.getByRole("form")
    const email = within(signUpForm).getByLabelText("Email")
    const username = within(signUpForm).getByLabelText("Username")
    const password = within(signUpForm).getByLabelText("Password")
    const confirmPassword =
      within(signUpForm).getByLabelText("Confirm Password")

    await expect(email).toBeVisible()
    await expect(username).toBeVisible()
    await expect(password).toBeVisible()
    await expect(confirmPassword).toBeVisible()
  },
}

/**
 * Demonstrates form validation errors
 */
export const ValidationErrors: Story = {
  play: async ({ canvas, userEvent }) => {
    const loginForm = canvas.getByRole("form")
    const loginButton = canvas.getByRole("button", { name: "Log In" })
    const emailInput = within(loginForm).getByLabelText("Email / Username")

    await userEvent.click(loginButton)

    await expect(emailInput).toHaveAccessibleErrorMessage(
      "Please fill out this field."
    )
  },
}

/**
 * Demonstrates tab switching with value persistence
 */
export const ValuePersistence: Story = {
  play: async ({ canvas, userEvent }) => {
    const EMAIL = "user@example.com"
    const PASSWORD = "MyPass123!"
    const loginForm = canvas.getByRole("form")
    const emailInput = within(loginForm).getByLabelText("Email / Username")
    const passwordInput = within(loginForm).getByLabelText("Password")
    const toggle = canvas.getByRole("switch", {
      name: "Switch between Login and Sign Up",
    })

    await userEvent.type(emailInput, EMAIL)
    await userEvent.type(passwordInput, PASSWORD)
    await userEvent.click(toggle)
    await userEvent.click(toggle)

    await expect(emailInput).toHaveValue(EMAIL)
    await expect(passwordInput).toHaveValue(PASSWORD)
  },
}

/**
 * Demonstrates password pattern validation in Sign Up
 */
export const PasswordValidation: Story = {
  play: async ({ canvas, userEvent }) => {
    const toggle = canvas.getByRole("switch", {
      name: "Switch between Login and Sign Up",
    })
    await userEvent.click(toggle)

    const signUpForm = canvas.getByRole("form")
    const emailInput = within(signUpForm).getByLabelText("Email")
    const passwordInput = within(signUpForm).getByLabelText("Password")
    const signUpButton = canvas.getByRole("button", { name: "Sign Up" })

    await userEvent.type(emailInput, "test@example.com")
    await userEvent.type(passwordInput, "weak")
    await userEvent.click(signUpButton)

    await expect(passwordInput).toHaveAccessibleErrorMessage(
      "Password must be at least 8 characters and contain uppercase, lowercase, number, and special character"
    )
  },
}

/**
 * Demonstrates password mismatch validation in Sign Up
 */
export const PasswordMismatch: Story = {
  play: async ({ canvas, userEvent }) => {
    const toggle = canvas.getByRole("switch", {
      name: "Switch between Login and Sign Up",
    })
    await userEvent.click(toggle)
    const signUpForm = canvas.getByRole("form")
    const emailInput = within(signUpForm).getByLabelText("Email")
    const passwordInput = within(signUpForm).getByLabelText("Password")
    const confirmPasswordInput =
      within(signUpForm).getByLabelText("Confirm Password")
    const signUpButton = canvas.getByRole("button", { name: "Sign Up" })

    await userEvent.type(emailInput, "test@example.com")
    await userEvent.type(passwordInput, "ValidPass123!")
    await userEvent.type(confirmPasswordInput, "DifferentPass123!")
    await userEvent.click(signUpButton)

    await expect(confirmPasswordInput).toHaveAccessibleErrorMessage(
      "Passwords do not match"
    )
  },
}
