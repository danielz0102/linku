import type { Meta, StoryObj } from "@storybook/react-vite"
import FormField from "./index"
import { expect } from "storybook/test"

const meta = {
  title: "UI/FormField",
  component: FormField,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className="w-[400px] rounded-xl bg-neutral-900 p-8">
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof FormField>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Simple email/username field
 */
export const EmailField: Story = {
  render: () => (
    <FormField>
      <FormField.Label htmlFor="email">Email / Username</FormField.Label>
      <FormField.Input
        id="email"
        type="text"
        placeholder="Enter your email or username"
      />
    </FormField>
  ),
}

/**
 * Password field with visibility toggle. Click the eye icon to show/hide the password.
 */
export const PasswordField: Story = {
  render: () => (
    <FormField>
      <FormField.Label htmlFor="password">Password</FormField.Label>
      <FormField.Input
        id="password"
        type="password"
        placeholder="Enter your password"
      />
    </FormField>
  ),
  play: async ({ userEvent, canvas }) => {
    const toggle = canvas.getByRole("button", { name: /show password/i })

    await userEvent.click(toggle)

    const input = canvas.getByLabelText("Password")
    await expect(input).toHaveAttribute("type", "text")
    await expect(toggle).toHaveAccessibleName(/hide password/i)
  },
}

/**
 * Password field without the visibility toggle.
 */
export const PasswordFieldWithoutToggle: Story = {
  render: () => (
    <FormField>
      <FormField.Label htmlFor="password">Password</FormField.Label>
      <FormField.Input
        id="password"
        type="password"
        placeholder="Enter your password"
        hideVisibilityToggle
      />
    </FormField>
  ),
}

/**
 * Field with an optional action link.
 */
export const FieldWithLink: Story = {
  render: () => (
    <FormField>
      <FormField.LabelRow>
        <FormField.Label htmlFor="password">Password</FormField.Label>
        <FormField.Link href="#">Forgot Password?</FormField.Link>
      </FormField.LabelRow>
      <FormField.Input
        id="password"
        type="password"
        placeholder="Enter your password"
      />
    </FormField>
  ),
}

/**
 * Required field validation. Submit the form with an empty field to see the error message.
 */
export const RequiredFieldValidation: Story = {
  render: () => (
    <form
      onSubmit={(e) => {
        e.preventDefault()
      }}
      className="flex flex-col gap-4"
    >
      <FormField>
        <FormField.Label htmlFor="email">Email</FormField.Label>
        <FormField.Input
          id="email"
          type="email"
          placeholder="Enter your email"
          required
        />
      </FormField>
      <button
        type="submit"
        className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
      >
        Submit
      </button>
    </form>
  ),
  play: async ({ userEvent, canvas }) => {
    const button = canvas.getByRole("button", { name: "Submit" })
    await userEvent.click(button)
    await expect(canvas.getByText("Please fill out this field.")).toBeVisible()

    const field = canvas.getByLabelText("Email")
    await expect(field).toBeInvalid()
  },
}

/**
 * Email format validation with custom error message. Enter an invalid email to see the error message.
 */
export const EmailValidation: Story = {
  render: () => (
    <form
      onSubmit={(e) => {
        e.preventDefault()
      }}
      className="flex flex-col gap-4"
    >
      <FormField>
        <FormField.Label htmlFor="email">Email</FormField.Label>
        <FormField.Input
          id="email"
          type="email"
          placeholder="Enter your email"
          defaultValue="invalid-email"
          setCustomError={(validity) => {
            if (validity.typeMismatch) {
              return "That's not an email!"
            }

            return ""
          }}
        />
      </FormField>
      <button
        type="submit"
        className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
      >
        Submit
      </button>
    </form>
  ),
  play: async ({ userEvent, canvas }) => {
    const button = canvas.getByRole("button", { name: "Submit" })
    await userEvent.click(button)
    await expect(canvas.getByText("That's not an email!")).toBeVisible()
  },
}
