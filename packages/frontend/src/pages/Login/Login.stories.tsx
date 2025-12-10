import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent } from "storybook/test"
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
export const LoginTab: Story = {}

/**
 * Sign up view with Sign Up tab active
 */
export const SignUpTab: Story = {
  play: async ({ canvas }) => {
    const toggle = canvas.getByRole("switch", {
      name: "Switch between Login and Sign Up",
    })
    await userEvent.click(toggle)

    await expect(
      canvas.getByText("Sign Up", { selector: "button[type='submit']" })
    ).toBeVisible()
    await expect(canvas.getByLabelText("Confirm Password")).toBeVisible()
  },
}

/**
 * Demonstrates form validation errors
 */
export const ValidationErrors: Story = {
  play: async ({ canvas }) => {
    const loginButton = canvas.getByRole("button", { name: "Log In" })

    await userEvent.click(loginButton)
    await expect(canvas.getByText("Please fill out this field.")).toBeVisible()

    const emailInput = canvas.getByLabelText("Email / Username")
    await userEvent.type(emailInput, "test@example.com")

    await userEvent.click(loginButton)
    await expect(
      canvas.getAllByText("Please fill out this field.")
    ).toHaveLength(1)
  },
}

/**
 * Demonstrates tab switching with value persistence
 */
export const ValuePersistence: Story = {
  play: async ({ canvas }) => {
    const emailInput = canvas.getByLabelText("Email / Username")
    const passwordInput = canvas.getByLabelText("Password")

    await userEvent.type(emailInput, "user@example.com")
    await userEvent.type(passwordInput, "MyPass123!")

    const toggle = canvas.getByRole("switch", {
      name: "Switch between Login and Sign Up",
    })
    await userEvent.click(toggle)

    await expect(
      canvas.getByText("Sign Up", { selector: "button[type='submit']" })
    ).toBeVisible()

    const signUpEmailInput = canvas.getByLabelText("Email / Username")
    const signUpPasswordInput = canvas.getByLabelText("Password")

    await expect(signUpEmailInput).toHaveValue("user@example.com")
    await expect(signUpPasswordInput).toHaveValue("MyPass123!")

    await userEvent.click(toggle)

    const loginEmailInput = canvas.getByLabelText("Email / Username")
    const loginPasswordInput = canvas.getByLabelText("Password")

    await expect(loginEmailInput).toHaveValue("user@example.com")
    await expect(loginPasswordInput).toHaveValue("MyPass123!")
  },
}

/**
 * Demonstrates password pattern validation in Sign Up
 */
export const PasswordValidation: Story = {
  play: async ({ canvas }) => {
    const toggle = canvas.getByRole("switch", {
      name: "Switch between Login and Sign Up",
    })
    await userEvent.click(toggle)

    const emailInput = canvas.getByLabelText("Email / Username")
    const passwordInput = canvas.getByLabelText("Password")
    const signUpButton = canvas.getByRole("button", { name: "Sign Up" })

    await userEvent.type(emailInput, "test@example.com")
    await userEvent.type(passwordInput, "weak")

    await userEvent.click(signUpButton)

    await expect(
      canvas.getByText(
        "Password must be at least 8 characters and contain uppercase, lowercase, number, and special character"
      )
    ).toBeVisible()
  },
}

/**
 * Demonstrates password mismatch validation in Sign Up
 */
export const PasswordMismatch: Story = {
  play: async ({ canvas }) => {
    const toggle = canvas.getByRole("switch", {
      name: "Switch between Login and Sign Up",
    })
    await userEvent.click(toggle)

    const emailInput = canvas.getByLabelText("Email / Username")
    const passwordInput = canvas.getByLabelText("Password")
    const confirmPasswordInput = canvas.getByLabelText("Confirm Password")
    const signUpButton = canvas.getByRole("button", { name: "Sign Up" })

    await userEvent.type(emailInput, "test@example.com")
    await userEvent.type(passwordInput, "ValidPass123!")
    await userEvent.type(confirmPasswordInput, "DifferentPass123!")

    await userEvent.click(signUpButton)

    await expect(canvas.getByText("Passwords do not match")).toBeVisible()
  },
}

/**
 * Demonstrates Google OAuth button interaction
 */
export const GoogleOAuth: Story = {
  play: async ({ canvas }) => {
    const googleButton = canvas.getByRole("button", {
      name: /continue with google/i,
    })

    await expect(googleButton).toBeVisible()
    await userEvent.click(googleButton)
  },
}
